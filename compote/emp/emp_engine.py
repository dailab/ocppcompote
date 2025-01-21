import json
import logging
import pathlib
import sys
from fastapi import FastAPI

from compote.emp.context.emp_context import EMPContext, set_shared_context
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

from compote.emp.empservice.empserviceroutes import router as EMPServiceRoutes
from compote.emp.empoicpservice.emp_oicp_service import create_api_app
from compote.emp.frontend.frontend import init
from compote.eroaming.mock_eroaming_service import create_oicp_app
from compote.shared.analytics.opentelemetry_configurator import configure_opentelemetry
from compote.shared.helper_functions import setup_logging

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

app.include_router(EMPServiceRoutes)

# OICP EMP module
app.mount("/api", create_api_app())

# Mock server
app.mount("/oicp", create_oicp_app())

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