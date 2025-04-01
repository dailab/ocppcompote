import asyncio
import logging
import sys
from asyncio import CancelledError

import websockets

from compote.cs.adapters.cs_ocpp16_handler import ChargePoint as OCPP16ChargePoint
from compote.cs.adapters.cs_ocpp201_handler import ChargePoint as OCPP201ChargePoint
from compote.cs.cs_context import Context

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('cs_ws_handler')

class CSWSHandler:

    async def run(self, context: Context):

        cs_config = await context.get_cs_config()
        wshandler_config = await context.get_wshandler_config()

        LOGGER.info("Initialized with wshandler_config: " + str(wshandler_config))

        ip = wshandler_config["url"]
        id = wshandler_config["id"]
        auth = wshandler_config["auth"]
        ocpp_versions = wshandler_config["ocpp_versions"]
        retry_interval = wshandler_config["retry_interval"]
        retry_maxtries = wshandler_config["retry_maxtries"]
        try_current = 0

        async def connect(ip, id, auth, retry_time: int, try_current: int, max_tries: int):
            LOGGER.info('Connecting to ws://' + id + ":" + auth + "@" + ip + '/' + id + ' (try: ' + str(try_current) + '/' + str(retry_maxtries) + ') using ' + str(ocpp_versions))
            try:
                async with websockets.connect(
                        'ws://' + ip + '/' + id,
                        subprotocols=ocpp_versions
                ) as ws:

                    cp = None

                    match ws.subprotocol:
                        case "ocpp1.6":
                            cp = OCPP16ChargePoint(id, ws)
                            cp.register_context(context)
                            await context.register_cp(cp)
                            await asyncio.gather(cp.start(), cp.send_boot_notification(**cs_config))
                        case "ocpp2.0":
                            cp = OCPP201ChargePoint(id, ws)
                            cp.register_context(context)
                            await context.register_cp(cp)
                            await asyncio.gather(cp.start(), cp.send_boot_notification())
                        case "ocpp2.0.1":
                            cp = OCPP201ChargePoint(id, ws)
                            cp.register_context(context)
                            await context.register_cp(cp)
                            await asyncio.gather(cp.start(), cp.send_boot_notification())
                        case other:
                            return await ws.close()

            except(OSError):
                logging.error("Connect failed to ws://" + ip + '/' + id)
                await asyncio.sleep(5)
            except(CancelledError):
                logging.error("CancelledError")

        while try_current < retry_maxtries:
            try_current += 1
            try:
                await connect(ip, id, auth, retry_interval, try_current, retry_maxtries)
            except(Exception):
                LOGGER.error("Connection Failed")
                await asyncio.sleep(5)

        if try_current is retry_maxtries:
            logging.error('Maximum number of connect tries reached: ' + str(try_current) + '/' + str(retry_maxtries))
            sys.exit(-1)
