import asyncio
import logging
from datetime import datetime

from ocpp.v201 import ChargePoint as cp
from ocpp.v201 import call
from compote.cs.cs_context import Context

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('cs_ocpp201_handler')

class ChargePoint(cp):

    def __init__(self, id, connection, response_timeout=30):
        super().__init__(id, connection, response_timeout)
        self.context: Context = None

    async def send_heartbeat(self, interval):
        request = call.HeartbeatPayload()
        while True:
            await self.call(request)
            await asyncio.sleep(interval)

    async def send_boot_notification(self):
        request = call.BootNotificationPayload(
            charging_station={"model": "Wallbox XYZ", "vendor_name": "anewone"},
            reason="PowerUp",
        )
        response = await self.call(request)

        if response.status == "Accepted":
            print("Connected to central system.")
            await self.send_heartbeat(response.interval)

    async def send_status_notification(self):
        return call.StatusNotificationPayload(
            {
                "timestamp": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S') + "Z",
                "connectorStatus": "Available",
                "evseId": 980,
                "connectorId": 197,
                "customData": {
                    "vendorId": "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }
            }
        )


    def register_context(self, context: Context):
        self.context = context