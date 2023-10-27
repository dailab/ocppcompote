import json
import logging
from pathlib import Path

import ocpp
from ocpp.v16.datatypes import ChargingProfile

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('set_charging_profile_processor')

class GenericSetChargingProfileProcessor:
    async def process(self, context: Context, connector_id = 1, charging_profile = None, **kwargs):
        return True

class OCPP16SetChargingProfileProcessor(GenericSetChargingProfileProcessor):
    @log_processing(name="process_set_charging_profile")
    async def process(self, context: Context, connector_id = 1, charging_profile = None, **kwargs):
        await super().process(context, connector_id, charging_profile)

        if charging_profile:
            profile = charging_profile["csChargingProfiles"]
        else:
            fn = "charging_profile.json"
            p = Path(__file__).parents[1] / "tmp" / fn

            try:
                profile = json.load(p.open())["csChargingProfile"]
            except ValueError:
                logging.error("Error while opening profile")
                return {}

        snake = ocpp.charge_point.camel_to_snake_case(profile)
        cp = ChargingProfile(**snake)
        result = await context.cp.send_set_charging_profile(connector_id, cp)
        return result

class OCPP20SetChargingProfileProcessor(GenericSetChargingProfileProcessor):
    @log_processing(name="process_set_charging_profile")
    async def process(self, context: Context, connector_id = 1, charging_profile = None, **kwargs):
        await super().process(context, connector_id, charging_profile)
        return True