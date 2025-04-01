import json
import logging
import pathlib
import sys
from fastapi import FastAPI

from compote.cs_everest.context.cs_everest_context import CSEverestContext, set_shared_context
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

from compote.cs_everest.cspncservice.cs_pnc_service import create_pnc_api_app
from compote.cs_everest.frontend import init
from compote.cs_everest.mqttservice.mqttserviceroutes import router as MQTTServiceRoutes

from compote.shared.analytics.opentelemetry_configurator import configure_opentelemetry
from compote.shared.helper_functions import setup_logging
from fastapi.middleware.cors import CORSMiddleware

logfile_name = setup_logging()

try:
    path = pathlib.Path(__file__).parents[1] / "tmp/config_cs_everest.json"
    config = json.load(open(path))["config"]
    message_type = "CSEVEREST.Initialization"
    function = "LoadConfig"
    arguments = config
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.info(msg)
except ValueError as e:
    message_type = "CSEVEREST.Initialization"
    function = "LoadConfig"
    arguments = str(e)
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.error(msg)
    sys.exit(-1)

config["logfile_name"] = logfile_name

cs_context = CSEverestContext(config=config)
set_shared_context(cs_context)

app = FastAPI(
    title="Everest CS Test",
    version="0.0.1",
    tags=["root"]
)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(MQTTServiceRoutes)

app.mount("/pnc_api", create_pnc_api_app())

# Telemetry
match cs_context.data["config"]["telemetry"]:
    case "zipkin":
        configure_opentelemetry(
            app,
            service_name="cseverest",
            exporter=ZipkinExporter(endpoint="http://localhost:9411/api/v2/spans")
        )
    case "console":
        configure_opentelemetry(
            app,
            service_name="cseverest",
            exporter=ConsoleSpanExporter()
        )
    case _:
        pass

# Initialize the UI
init(app, cs_context)