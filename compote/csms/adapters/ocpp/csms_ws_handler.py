import logging
import websockets

from compote.csms.adapters.ocpp.csms_ocpp16_handler import ChargePoint as OCPP16ChargePoint
from compote.csms.adapters.ocpp.csms_ocpp201_handler import ChargePoint as OCPP201ChargePoint
from compote.csms.context.csms_contextmanager import ContextManager

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_ws_handler')

class CSMSWSHandler:

    context_manager: ContextManager = None

    async def on_connect(self, websocket, path):
        """ For every new charge point that connects, create a ChargePoint
        instance and start listening for messages.
        """
        try:
            requested_protocols = websocket.request_headers[
                'Sec-WebSocket-Protocol']
        except KeyError:
            logging.error(
                "Client hasn't requested any Subprotocol. Closing Connection"
            )
            return await websocket.close()
        if websocket.subprotocol:
            LOGGER.info("Protocols Matched: %s", websocket.subprotocol)
        else:
            # In the websockets lib if no subprotocols are supported by the
            # cs and the server, it proceeds without a subprotocol,
            # so we have to manually close the connection.
            logging.warning('Protocols Mismatched | Expected Subprotocols: %s,'
                            ' but cs supports  %s | Closing connection',
                            websocket.available_subprotocols,
                            requested_protocols)
            return await websocket.close()

        charge_point_id = path.strip('/')

        cp = None

        match websocket.subprotocol:
            case "ocpp1.6": cp = OCPP16ChargePoint(charge_point_id, websocket)
            case "ocpp2.0": cp = OCPP201ChargePoint(charge_point_id, websocket)
            case "ocpp2.0.1": cp = OCPP201ChargePoint(charge_point_id, websocket)
            case other: return await websocket.close()

        context = await self.context_manager.register_new_cp_context(cp)
        await cp.register_context(context)

        try:
            await cp.start()
        except Exception:
            LOGGER.error("Connection Failure in WebSocket Handler")


    async def run(self, context_manager: ContextManager):
        self.context_manager = context_manager
        wshandler_config = await self.context_manager.get_wshandler_config()

        LOGGER.info("Initialized with wshandler_config: " + str(wshandler_config))

        server = await websockets.serve(
            self.on_connect,
            wshandler_config["ip"],
            wshandler_config["port"],
            subprotocols=wshandler_config["ocpp_versions"]
        )

        LOGGER.info("Server Started listening to new connections...")
        await server.wait_closed()