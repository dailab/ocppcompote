import json
import pathlib

from fastapi import FastAPI
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

from compote.csms.adapters.ocpp.csms_ws_handler import create_ocpp_ws_app
from compote.csms.adapters.rest.ui_adapter_fastapi import create_ui_app
from compote.csms.adapters.rest.webservice_adapter_fastapi import create_api_app
from compote.csms.context.csms_contextmanager import ContextManager, set_shared_context_manager
from compote.csms.cpooicpservice.cpo_oicp_service import create_oicp_api_app
from compote.csms.cpopncservice.cpo_pnc_service import create_pnc_api_app
from compote.shared.analytics.opentelemetry_configurator import configure_opentelemetry
from compote.shared.helper_functions import setup_logging
from fastapi.middleware.cors import CORSMiddleware

import logging

"""Main entrypoint for running csms and starting webservice adapter and ocpp protocol handler"""

logfile_name = setup_logging()

app = FastAPI(
    title="CPO Test Toolkit",
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

try:
    path = pathlib.Path(__file__).parents[1] / "tmp/config_csms_16.json"
    config = json.load(open(path))["config"]
    message_type = "CSMS.Initialization"
    function = "LoadConfig"
    arguments = config
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.info(msg)

except ValueError as e:
    message_type = "CSMS.Initialization"
    function = "LoadConfig"
    arguments = e
    msg = {"message_type": message_type, "function": function, "arguments": arguments}
    logging.error(msg)
    raise RuntimeError("Error loading configuration") from e

match config["telemetry"]:
    case "zipkin":
        configure_opentelemetry(
            app,
            service_name="csms",
            exporter=ZipkinExporter(endpoint="http://localhost:9411/api/v2/spans")
        )
    case "console":
        configure_opentelemetry(
            app,
            service_name="csms",
            exporter=ConsoleSpanExporter()
        )
    case _:
        pass

@app.on_event('startup')
async def main():

    context_manager = ContextManager(config=config, logfile_name=logfile_name)
    set_shared_context_manager(context_manager)

    # Create a sub-application for API
    api_app = create_api_app(context_manager)
    app.mount("/api", api_app)

    # Create a sub-application for OICP API
    oicp_api_app = create_oicp_api_app()
    app.mount("/oicp_api", oicp_api_app)

    # Create a sub-application for PnC API
    pnc_api_app = create_pnc_api_app()
    app.mount("/pnc_api", pnc_api_app)

    # Create a sub-application for UI
    ui_app = create_ui_app(context_manager)
    app.mount("/ui", ui_app)

    # Create a sub-application for OCPP WebSocket connections
    ocpp_ws_subapp = create_ocpp_ws_app(context_manager)
    app.mount("/ocpp", ocpp_ws_subapp)


@app.on_event("shutdown")
async def shutdown_event():
    message_type = "CSMS.Shutdown"
    function = "Exit"
    msg = {"message_type": message_type, "function": function, "arguments": {}}
    logging.info(msg)