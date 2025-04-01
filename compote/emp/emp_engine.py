import json
import logging
import pathlib
import sys
from fastapi import FastAPI

from compote.emp.context.emp_context import EMPContext, set_shared_context
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

from compote.emp.emppncservice.emp_pnc_service import create_pnc_api_app
from compote.emp.empservice.empserviceroutes import router as EMPServiceRoutes
from compote.emp.empoicpservice.emp_oicp_service import create_api_app
from compote.emp.frontend.frontend import init
from compote.shared.analytics.opentelemetry_configurator import configure_opentelemetry
from compote.shared.helper_functions import setup_logging
from fastapi.middleware.cors import CORSMiddleware

logfile_name = setup_logging()

try:
    path = pathlib.Path(__file__).parents[1] / "tmp/config_emp.json"
    config = json.load(open(path))["config"]
    message_type = "EMPMS.Initialization"
    function = "LoadConfig"
    arguments = config
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.info(msg)
except ValueError as e:
    message_type = "EMPMS.Initialization"
    function = "LoadConfig"
    arguments = str(e)
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.error(msg)
    sys.exit(-1)

config["logfile_name"] = logfile_name

# Initialize context
emp_context = EMPContext(config=config)
set_shared_context(emp_context)

# Provide EMP app
app = FastAPI(
    title="EMP Test Toolkit",
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


app.include_router(EMPServiceRoutes)

# OICP EMP module
app.mount("/oicp_api", create_api_app())

app.mount("/pnc_api", create_pnc_api_app())

# Telemetry
match emp_context.data["config"]["telemetry"]:
    case "zipkin":
        configure_opentelemetry(
            app,
            service_name="empms",
            exporter=ZipkinExporter(endpoint="http://localhost:9411/api/v2/spans")
        )
    case "console":
        configure_opentelemetry(
            app,
            service_name="empms",
            exporter=ConsoleSpanExporter()
        )
    case _:
        pass

# Initialize the UI
init(app, emp_context)