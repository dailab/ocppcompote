# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_reservation_start import ERoamingAuthorizeRemoteReservationStart
from compote.eroaming.models.e_roaming_authorize_remote_reservation_stop import ERoamingAuthorizeRemoteReservationStop


class BaseERoamingReservationApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseERoamingReservationApi.subclasses = BaseERoamingReservationApi.subclasses + (cls,)
    async def e_roaming_authorize_remote_reservation_start_v1_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_authorize_remote_reservation_start: ERoamingAuthorizeRemoteReservationStart,
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;   * This operation is used by EMPs in order to remotely reserve a charging point.  ![Reservation start diagram](images/reservationstart.png)  __Functional Description:__  Scenario:  A customer of an EMP wants to reserve a charging point of a CPO for a later charging process. The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application. The EMP’s provider system can then initiate a reservation of the CPO’s charging point by sending an eRoamingAuthorizeRemoteReservationStart request to Hubject. The request &#x60;MUST&#x60; contain the ProviderID and the EvseID. The demanded reservation product can be specified using the field PartnerProductID.  Hubject will derive the CPO’s OperatorID from the EvseID.  Hubject will check whether there is a valid contract between the two partners for the service Reservation (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.  In case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the reservation process and forwards the request (including the SessionID) to the CPO. The CPO MUST return an eRoamingAcknowledgement message that MUST contain the result indicating whether the reservation was successful and that MAY contain a status code for further information.  In case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error. """
        ...


    async def e_roaming_authorize_remote_reservation_stop_v1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_authorize_remote_reservation_stop: ERoamingAuthorizeRemoteReservationStop,
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;RECEIVE&#x60;   * Implementation: &#x60;OPTIONAL&#x60;  ![Reservation stop diagram](images/reservationstop.png)  eRoamingAuthorizeRemoteReservationStop basically works in the same way as eRoamingAuthorizeRemoteReservationStart. The only difference is that this request is sent in order to end the reservation of a charging spot. The request &#x60;MUST&#x60; contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteReservationStart request. After the eRoamingAuthorizeRemoteReservationStop the CPO &#x60;MUST&#x60; provide a CDR. """
        ...
