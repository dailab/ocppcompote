import json
import logging
import pathlib
import sys

from fastapi import FastAPI
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

from compote.eroaming.context.eroaming_context import ERoamingContext, set_shared_context
from compote.eroaming.eroaming_routes import create_oicp_app
from compote.shared.analytics.opentelemetry_configurator import configure_opentelemetry
from compote.shared.helper_functions import setup_logging
from fastapi.middleware.cors import CORSMiddleware


logfile_name = setup_logging()

try:
    path = pathlib.Path(__file__).parents[1] / "tmp/config_eroaming.json"
    config = json.load(open(path))["config"]
    message_type = "ERoaming.Initialization"
    function = "LoadConfig"
    arguments = config
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.info(msg)
except ValueError as e:
    message_type = "ERoaming.Initialization"
    function = "LoadConfig"
    arguments = str(e)
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.error(msg)
    sys.exit(-1)

config["logfile_name"] = logfile_name

# Initialize context
eroaming_context = ERoamingContext(config=config)
set_shared_context(eroaming_context)

# Provide ERoaming Mock app
app = FastAPI(
    title="ERoaming Mock Service",
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

# OICP EMP module
app.mount("/oicp", create_oicp_app())

# Telemetry
match eroaming_context.data["config"]["telemetry"]:
    case "zipkin":
        configure_opentelemetry(
            app,
            service_name="eroaming",
            exporter=ZipkinExporter(endpoint="http://localhost:9411/api/v2/spans")
        )
    case "console":
        configure_opentelemetry(
            app,
            service_name="eroaming",
            exporter=ConsoleSpanExporter()
        )
    case _:
        pass
