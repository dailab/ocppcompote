
from typing import Any

from ocpp.v16.enums import ChargingRateUnitType
from ocpp.v201.enums import ChargingRateUnitType as ChargingRateUnitTypeOCPP20

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

class GenericGetCompositeScheduleProcessor:
    async def process(self, context: Context, connector_id: int, duration: int, charging_rate_unit: Any = None, **kwargs):
        return True

class OCPP16GetCompositeScheduleProcessor(GenericGetCompositeScheduleProcessor):
    @log_processing(name="process_get_composite_schedule")
    async def process(self, context: Context, connector_id: int, duration: int, charging_rate_unit: ChargingRateUnitType = None, **kwargs):
        await super().process(context, connector_id, duration, charging_rate_unit)
        result = await context.cp.send_get_composite_schedule(connector_id, duration, charging_rate_unit)
        return result

class OCPP20GetCompositeScheduleProcessor(GenericGetCompositeScheduleProcessor):
    @log_processing(name="process_get_composite_schedule")
    async def process(self, context: Context, connector_id: int, duration: int, charging_rate_unit: ChargingRateUnitTypeOCPP20 = None, **kwargs):
        await super().process(context, connector_id, duration, charging_rate_unit)
        result = await context.cp.send_get_composite_schedule(connector_id, duration, charging_rate_unit)
        return result