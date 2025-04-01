
from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_evse_status_api_base import BaseERoamingEvseStatusApi
from compote.eroaming.context.eroaming_context import ERoamingContext
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_pull_evse_status_v21200_response import ERoamingPullEvseStatusV21200Response
from compote.eroaming.models.e_roaming_pull_evse_status_v21_request import ERoamingPullEvseStatusV21Request
from compote.eroaming.models.e_roaming_push_evse_status import ERoamingPushEvseStatus


class BaseERoamingEvseStatusImpl(BaseERoamingEvseStatusApi):

    def __init__(self):
        super()

    async def e_roaming_pull_evse_status_v2_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_status_v21_request: ERoamingPullEvseStatusV21Request,
        context: ERoamingContext
    ) -> ERoamingPullEvseStatusV21200Response:


      cs_status_data = context.data.get("cs_status_data", [])

      response_data = {
        "actual_instance": {
          "EvseStatuses": {
            "OperatorEvseStatus": cs_status_data
          },
          "StatusCode": {
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Success"
          },
        },
        "one_of_schemas": [
          "ERoamingEVSEStatus"
        ]
      }

      return ERoamingPullEvseStatusV21200Response.parse_obj(response_data)

    async def e_roaming_push_evse_status_v2_1(
            self,
            operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
            e_roaming_push_evse_status: ERoamingPushEvseStatus,
            context: ERoamingContext
    ) -> ERoamingAcknowledgment:
        if "cs_status_data" not in context.data:
            context.data["cs_status_data"] = []

        converted_data = {
            "OperatorID": e_roaming_push_evse_status.operator_evse_status.operator_id,
            "OperatorName": e_roaming_push_evse_status.operator_evse_status.operator_name,
            "EvseStatusRecord": [
                {
                    "EvseID": record.evse_id,
                    "EvseStatus": record.evse_status
                }
                for record in e_roaming_push_evse_status.operator_evse_status.evse_status_record
            ]
        }

        context.data["cs_status_data"].append(converted_data)

        testdata = {
            "Result": True,
            "StatusCode": {
                "AdditionalInfo": "Success",
                "Code": "000",
                "Description": "Success"
            },
            "SessionID": "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
            "CPOPartnerSessionID": "1234XYZ",
            "EMPPartnerSessionID": "2345ABC"
        }

        return ERoamingAcknowledgment.parse_obj(testdata)
