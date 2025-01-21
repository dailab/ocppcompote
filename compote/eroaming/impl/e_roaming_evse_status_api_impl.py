# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_evse_status_api_base import BaseERoamingEvseStatusApi
from compote.eroaming.models.e_roaming_pull_evse_status_v21200_response import ERoamingPullEvseStatusV21200Response
from compote.eroaming.models.e_roaming_pull_evse_status_v21_request import ERoamingPullEvseStatusV21Request


class BaseERoamingEvseStatusImpl(BaseERoamingEvseStatusApi):

    def __init__(self):
        super()

    async def e_roaming_pull_evse_status_v2_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_status_v21_request: ERoamingPullEvseStatusV21Request,
    ) -> ERoamingPullEvseStatusV21200Response:
        testdata = {
      "oneof_schema_1_validator": {
        "EvseStatuses": {
          "OperatorEvseStatus": [
            {
              "OperatorID": "DE*ABC",
              "OperatorName": "string",
              "EvseStatusRecord": [
                {
                  "EvseID": "DE*XYZ*ETEST1",
                  "EvseStatus": "Available"
                }
              ]
            }
          ]
        },
        "StatusCode": {
          "Code": "string",
          "Description": "string",
          "AdditionalInfo": "string"
        }
      },
      "oneof_schema_2_validator": {
        "EVSEStatusRecords": {
          "EvseStatusRecord": [
            {
              "EvseID": "DE*XYZ*ETEST1",
              "EvseStatus": "Available"
            }
          ]
        },
        "StatusCode": {
          "Code": "string",
          "Description": "string",
          "AdditionalInfo": "string"
        }
      },
      "actual_instance": {
        "EvseStatuses": {
          "OperatorEvseStatus": [
            {
              "OperatorID": "DE*ABC",
              "OperatorName": "string",
              "EvseStatusRecord": [
                {
                  "EvseID": "DE*XYZ*ETEST1",
                  "EvseStatus": "Available"
                }
              ]
            }
          ]
        },
        "StatusCode": {
          "Code": "string",
          "Description": "string",
          "AdditionalInfo": "string"
        }
      },
      "one_of_schemas": [
        "string"
      ]
    }

        return ERoamingPullEvseStatusV21200Response.parse_obj(testdata)
