
import datetime
from typing import ClassVar, Dict, List, Tuple  # noqa: F401

import httpx
from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_reservation_api_base import BaseERoamingReservationApi
from compote.eroaming.context.eroaming_context import ERoamingContext
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
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        payload = e_roaming_authorize_remote_reservation_start.dict(by_alias=True, exclude_none=True)

        if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
            payload["LastCall"] = payload["LastCall"].isoformat()

        endpoint_url = (
            f"{context.data['config']['cpo_config']['CPO_URL']}"
            f"/authorizeremotereservationstartv11"
        )

        async with httpx.AsyncClient() as client:
            response = await client.post(endpoint_url, json=payload)
            response.raise_for_status()

        return response.json()

        # testdata = {
        #   "Result": True,
        #   "StatusCode": {
        #     "AdditionalInfo": "Success",
        #     "Code": "000",
        #     "Description": "Success"
        #   },
        #   "SessionID": e_roaming_authorize_remote_reservation_start.session_id,
        #   "CPOPartnerSessionID": e_roaming_authorize_remote_reservation_start.cpo_partner_session_id,
        #   "EMPPartnerSessionID": e_roaming_authorize_remote_reservation_start.emp_partner_session_id,
        # }
        #
        # return ERoamingAcknowledgment.parse_obj(testdata)


    async def e_roaming_authorize_remote_reservation_stop_v1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_authorize_remote_reservation_stop: ERoamingAuthorizeRemoteReservationStop,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        payload = e_roaming_authorize_remote_reservation_stop.dict(by_alias=True, exclude_none=True)

        if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
            payload["LastCall"] = payload["LastCall"].isoformat()

        endpoint_url = (
            f"{context.data['config']['cpo_config']['CPO_URL']}"
            f"/authorizeremotereservationstopv1"
        )

        async with httpx.AsyncClient() as client:
            response = await client.post(endpoint_url, json=payload)
            response.raise_for_status()

        return response.json()
        #
        # testdata = {
        #   "Result": True,
        #   "StatusCode": {
        #     "AdditionalInfo": "Success",
        #     "Code": "000",
        #     "Description": "Success"
        #   },
        #   "SessionID": e_roaming_authorize_remote_reservation_stop.session_id,
        #   "CPOPartnerSessionID": e_roaming_authorize_remote_reservation_stop.cpo_partner_session_id,
        #   "EMPPartnerSessionID": e_roaming_authorize_remote_reservation_stop.emp_partner_session_id,
        # }
        #
        # return ERoamingAcknowledgment.parse_obj(testdata)