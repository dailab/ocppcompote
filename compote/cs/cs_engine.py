import json
import sys
import os
file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import asyncio
import logging
from compote.cs.adapters.cs_ws_handler import CSWSHandler
from compote.cs.sims.cs_sequential_sim import CsSequentialSim
from compote.shared.helper_functions import setup_logging
import pathlib


class CSEngine:
    """Main entrypoint for running cs and ocpp protocol handler"""
    async def main(config_file: str = None, config_key: str = None):

        try:
            if config_file and config_key:
                config = json.load(open(config_file))[config_key]
            else:
                path = pathlib.Path(__file__).parents[1] /"cs/tmp/config_cs_16.json"
                config = json.load(open(path))["config_1"]
        except ValueError:
            logging.error("Error while parsing config")
            sys.exit(-1)

        logging.info("Loaded cs config: " + str(config))

        if "id" not in config["wshandler_config"]:
            config["wshandler_config"]["id"] = str(sys.argv[1]) or "CP_Identity_1"

        context = CsSequentialSim(config=config)
        wshandler_task = asyncio.create_task(CSWSHandler().run(context))

        await context.set_wshandler_task(wshandler_task)
        await wshandler_task

        logging.info("Exit CS")

if __name__ == "__main__":
    setup_logging()
    asyncio.run(CSEngine().main())