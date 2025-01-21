from typing import Optional, Dict

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericUnlockConnectorProcessor:
    async def process(self, context: Context, connector_id: int, **kwargs):
        return True

class OCPP16UnlockConnectorProcessor(GenericUnlockConnectorProcessor):
    @log_processing(name="process_unlock_connector")
    async def process(self, context: Context, connector_id: int, **kwargs):
        if connector_id:
            result = await context.cp.send_unlock_connector(connector_id)
        else:
            result = await context.cp.send_unlock_connector(0)
        return result

class OCPP20UnlockConnectorProcessor(GenericUnlockConnectorProcessor):
    @log_processing(name="process_unlock_connector")
    async def process(self, context: Context, evse_id: int, connector_id: int, custom_data: Optional[Dict] = None, **kwargs):
        result = await context.cp.send_unlock_connector(evse_id, connector_id, custom_data)
        return result

