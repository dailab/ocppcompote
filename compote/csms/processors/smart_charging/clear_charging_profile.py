from typing import Any, Optional, Dict

from ocpp.v16.enums import ChargingProfilePurposeType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericClearChargingProfileProcessor:
    async def process(self, context: Context, id: int, connector_id: int, charging_profile_purpose: Any, stack_level: int = None, **kwargs):
        return True

class OCPP16ClearChargingProfileProcessor(GenericClearChargingProfileProcessor):
    @log_processing(name="process_clear_charging_profile")
    async def process(self, context: Context, id: int, connector_id: int, charging_profile_purpose: ChargingProfilePurposeType, stack_level: int, **kwargs):
        await super().process(context, id, connector_id, charging_profile_purpose, stack_level)
        result = await context.cp.send_clear_charging_profile(id, connector_id, charging_profile_purpose, stack_level)
        return result

class OCPP20ClearChargingProfileProcessor(GenericClearChargingProfileProcessor):
    @log_processing(name="process_clear_charging_profile")
    async def process(self, context: Context, charging_profile_id: Optional[int] = None, charging_profile_criteria: Optional[Dict] = None, stack_level: int = None, **kwargs):
        await super().process(context, id=charging_profile_id, charging_profile_purpose=charging_profile_criteria, stack_level=stack_level)
        result = await context.cp.send_clear_charging_profile(id,charging_profile_criteria, stack_level)
        return result