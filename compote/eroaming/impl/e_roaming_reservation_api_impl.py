# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_reservation_api_base import BaseERoamingReservationApi
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_reservation_start import ERoamingAuthorizeRemoteReservationStart
from compote.eroaming.models.e_roaming_authorize_remote_reservation_stop import ERoamingAuthorizeRemoteReservationStop


class BaseERoamingReservationApiImpl(BaseERoamingReservationApi):
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseERoamingReservationApi.subclasses = BaseERoamingReservationApi.subclasses + (cls,)
    async def e_roaming_authorize_remote_reservation_start_v1_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_authorize_remote_reservation_start: ERoamingAuthorizeRemoteReservationStart,
    ) -> ERoamingAcknowledgment:
        testdata = {
          "Result": True,
          "StatusCode": {
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Success"
          },
          "SessionID": e_roaming_authorize_remote_reservation_start.session_id,
          "CPOPartnerSessionID": e_roaming_authorize_remote_reservation_start.cpo_partner_session_id,
          "EMPPartnerSessionID": e_roaming_authorize_remote_reservation_start.emp_partner_session_id,
        }

        return ERoamingAcknowledgment.parse_obj(testdata)


    async def e_roaming_authorize_remote_reservation_stop_v1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_authorize_remote_reservation_stop: ERoamingAuthorizeRemoteReservationStop,
    ) -> ERoamingAcknowledgment:
        testdata = {
          "Result": True,
          "StatusCode": {
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Success"
          },
          "SessionID": e_roaming_authorize_remote_reservation_stop.session_id,
          "CPOPartnerSessionID": e_roaming_authorize_remote_reservation_stop.cpo_partner_session_id,
          "EMPPartnerSessionID": e_roaming_authorize_remote_reservation_stop.emp_partner_session_id,
        }

        return ERoamingAcknowledgment.parse_obj(testdata)