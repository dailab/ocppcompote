
from typing import Any

from ocpp.v16.enums import MessageTrigger
from ocpp.v201.enums import MessageTriggerType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericTriggerMessageProcessor:
    async def process(self, context: Context, requested_message: Any, connector_id: int, **kwargs):
        return True

class OCPP16TriggerMessageProcessor(GenericTriggerMessageProcessor):
    @log_processing(name="process_trigger_message")
    async def process(self, context: Context, requested_message: MessageTrigger, connector_id: int, **kwargs):
        await super().process(context, requested_message, connector_id, **kwargs)
        result = await context.cp.send_trigger_message(requested_message, connector_id)
        return result

class OCPP20TriggerMessageProcessor(GenericTriggerMessageProcessor):
    @log_processing(name="process_trigger_message")
    async def process(self, context: Context, requested_message: MessageTriggerType, connector_id: int, **kwargs):
        await super().process(context, requested_message, connector_id, **kwargs)
        result = await context.cp.send_trigger_message(requested_message, connector_id)
        return result