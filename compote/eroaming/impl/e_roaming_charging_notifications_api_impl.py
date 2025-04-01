
from compote.eroaming.apis.e_roaming_charging_notifications_api_base import BaseERoamingChargingNotificationsApi
from compote.eroaming.context.eroaming_context import ERoamingContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_charging_notifications_v11_request import ERoamingChargingNotificationsV11Request


class BaseERoamingChargingNotificationsImpl(BaseERoamingChargingNotificationsApi):

    def __init__(self):
        super()

    async def e_roaming_charging_notifications_v1_1(
        self,
        e_roaming_charging_notifications_v11_request: ERoamingChargingNotificationsV11Request,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        testdata = {
          "Result": True,
          "StatusCode": {
            "Code": "Success",
            "Description": "000",
            "AdditionalInfo": "Success"
          },
          "SessionID": "b2688855-7f00-0002-6d8e-48d883f6abb6",
          "CPOPartnerSessionID": "1234XYZ",
          "EMPPartnerSessionID": "2345ABC"
        }

        return ERoamingAcknowledgment.parse_obj(testdata)