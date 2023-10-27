
from typing import Any, Optional, Dict

from ocpp.v16.enums import AvailabilityType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

class GenericChangeAvailabilityProcessor:
    async def process(self, context: Context, connector_id: Any, type = Any, **kwargs):
        return True

class OCPP16ChangeAvailabilityProcessor(GenericChangeAvailabilityProcessor):
    @log_processing(name="process_change_availability")
    async def process(self, context: Context, connector_id: int, type = AvailabilityType, **kwargs):
        await super().process(context, connector_id, type, **kwargs)
        result = await context.cp.send_change_availability(connector_id, type)
        return result

class OCPP20ChangeAvailabilityProcessor(GenericChangeAvailabilityProcessor):
    @log_processing(name="process_change_availability")
    async def process(self, context: Context, operational_status: str, evse: Optional[Dict], **kwargs):
        await super().process(context, connector_id=evse, type=operational_status, **kwargs)
        result = await context.cp.send_change_availability(operational_status, evse)
        return result