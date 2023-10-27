import json
import sys
import pathlib

from compote.csms.adapters.ocpp.csms_ws_handler import CSMSWSHandler
from compote.csms.adapters.rest.webservice_adapter import WebServiceAdapter
from compote.csms.context.csms_contextmanager import ContextManager
from compote.shared.helper_functions import setup_logging

import asyncio
import logging

async def main():
    logfile_name = setup_logging()
    loop = asyncio.get_event_loop()

    try:
        path = pathlib.Path(__file__).parents[1] /"tmp/config_csms_16.json"
        config = json.load(open(path))["config"]
        logging.info("Loaded csms config: " + str(config))
    except ValueError:
        logging.ERROR("Error while parsing config")
        sys.exit(-1)

    context_manager = ContextManager(config=config, logfile_name=logfile_name)
    webservice_task = asyncio.create_task(WebServiceAdapter(context_manager).run())
    wshandler_task = asyncio.create_task(CSMSWSHandler().run(context_manager))

    await webservice_task
    await wshandler_task
    loop.run_forever()
    logging.info("Exit CSMS")

if __name__ == "__main__":
    asyncio.run(main())