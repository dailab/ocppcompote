
from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericUnlockConnectorProcessor:
    @log_processing(name="process_unlock_connector")
    async def process(self, context: Context, connector_id: int, **kwargs):
        if connector_id:
            result = await context.cp.send_unlock_connector(connector_id)
        else:
            result = await context.cp.send_unlock_connector(0)
        return result

class OCPP16UnlockConnectorProcessor(GenericUnlockConnectorProcessor):
    pass

class OCPP20UnlockConnectorProcessor(GenericUnlockConnectorProcessor):
    pass