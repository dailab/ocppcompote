from typing import Any

from ocpp.v16.datatypes import MeterValue

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericMeterValuesProcessor:
    async def process(self, context: Context, connector_id: int, meter_value: Any):
        context.cp_data["connectors"][connector_id]["meter_values"].append(meter_value)
        return True

class OCPP16MeterValuesProcessor(GenericMeterValuesProcessor):
    @log_processing(name="process_meter_values")
    async def process(self, context: Context, connector_id: int, meter_value: MeterValue):
        await super().process(context, connector_id, meter_value)
        return True

class OCPP20MeterValuesProcessor(GenericMeterValuesProcessor):
    @log_processing(name="process_meter_values")
    async def process(self, context: Context, evse_id: int, meter_value: MeterValue):
        await super().process(context, evse_id, meter_value)
        return True