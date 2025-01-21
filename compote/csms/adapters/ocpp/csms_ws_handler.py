# ocpp_ws_app.py

import logging
from fastapi import FastAPI, WebSocket

from compote.csms.adapters.ocpp.csms_ocpp16_handler import ChargePoint as OCPP16ChargePoint
from compote.csms.adapters.ocpp.csms_ocpp201_handler import ChargePoint as OCPP201ChargePoint
from compote.csms.context.csms_contextmanager import ContextManager

LOGGER = logging.getLogger("csms_ws_handler")

def create_ocpp_ws_app(context_manager: ContextManager) -> FastAPI:
    """
    Returns a FastAPI sub-application that handles OCPP WebSockets.
    """
    ws_app = FastAPI(
        title="CSMS OCPP Websocket Service",
        version="0.0.1",
        tags=["ocpp"]
    )

    @ws_app.on_event("startup")
    async def startup_event():
        config = await context_manager.get_wshandler_config()
        LOGGER.info({
            "message_type": "CSMS.WebsocketAdapter.Info",
            "function": "Start",
            "arguments": config
        })

    @ws_app.websocket("/{charge_point_id}")
    async def ocpp_websocket(websocket: WebSocket, charge_point_id: str):
        """
        Single endpoint to handle WebSocket connections for OCPP 1.6, 2.0, 2.0.1, etc.
        """
        requested_protocols = websocket.scope.get("subprotocols", [])

        if not requested_protocols:
            LOGGER.error("Client hasn't requested any subprotocols. Closing connection.")
            await websocket.close()
            return

        wshandler_config = await context_manager.get_wshandler_config()
        supported_subprotocols = wshandler_config["ocpp_versions"]

        chosen_subprotocol = None
        for candidate in requested_protocols:
            if candidate in supported_subprotocols:
                chosen_subprotocol = candidate
                break

        if not chosen_subprotocol:
            # No matching subprotocol found
            LOGGER.warning(
                "Protocols Mismatched | Expected Subprotocols: %s, but client supports %s | Closing connection",
                supported_subprotocols, requested_protocols
            )
            await websocket.close()
            return

        # Accept the connection with the chosen subprotocol
        await websocket.accept(subprotocol=chosen_subprotocol)

        # Logging
        LOGGER.info({
            "message_type": "CSMS.WebsocketAdapter.Info",
            "function": "MatchSubprotocol",
            "arguments": {"protocol": chosen_subprotocol}
        })


        match chosen_subprotocol:
            case "ocpp1.6":
                cp = OCPP16ChargePoint(charge_point_id, websocket)
            case "ocpp2.0" | "ocpp2.0.1":
                cp = OCPP201ChargePoint(charge_point_id, websocket)
            case "ocpp2.1":
                # Not supported at the moment.
                await websocket.close()
                return
            case _:
                await websocket.close()
                return

        # Register a new context for this charge point
        context = await context_manager.register_new_cp_context(cp)
        await cp.register_context(context)

        try:
            await cp.start()
        except Exception as e:
            LOGGER.error({
                "message_type": "CSMS.WebsocketAdapter.Error",
                "function": "ConnectionFailure",
                "arguments": {"error": str(e)}
            })
            await websocket.close()

    return ws_app