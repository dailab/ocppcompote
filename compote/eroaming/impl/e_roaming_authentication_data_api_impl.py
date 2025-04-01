# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401
from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_authentication_data_api_base import \
    BaseERoamingAuthenticationDataApi
from compote.eroaming.context.eroaming_context import ERoamingContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_push_authentication_data import ERoamingPushAuthenticationData


class BaseERoamingAuthenticationDataImpl(BaseERoamingAuthenticationDataApi):

    def __init__(self):
        super()

    async def e_roaming_push_authentication_data_v2_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_push_authentication_data: ERoamingPushAuthenticationData,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        testdata = {
          "Result": True,
          "StatusCode": {
            "Code": "string",
            "Description": "string",
            "AdditionalInfo": "string"
          },
          "SessionID": "b2688855-7f00-0002-6d8e-48d883f6abb6",
          "CPOPartnerSessionID": "string",
          "EMPPartnerSessionID": "string"
        }

        return ERoamingAcknowledgment.parse_obj(testdata)
