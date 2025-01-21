# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorization_start import ERoamingAuthorizationStart
from compote.eroaming.models.e_roaming_authorization_stop import ERoamingAuthorizationStop
from compote.eroaming.models.e_roaming_authorize_remote_start import ERoamingAuthorizeRemoteStart
from compote.eroaming.models.e_roaming_authorize_remote_stop import ERoamingAuthorizeRemoteStop
from compote.eroaming.models.e_roaming_authorize_start import ERoamingAuthorizeStart
from compote.eroaming.models.e_roaming_authorize_stop import ERoamingAuthorizeStop
from compote.eroaming.models.e_roaming_charge_detail_record import ERoamingChargeDetailRecord
from compote.eroaming.models.e_roaming_charge_detail_records import ERoamingChargeDetailRecords
from compote.eroaming.models.e_roaming_get_charge_detail_records import ERoamingGetChargeDetailRecords


class BaseERoamingAuthorizationApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseERoamingAuthorizationApi.subclasses = BaseERoamingAuthorizationApi.subclasses + (cls,)
    async def e_roaming_authorize_remote_start_v2_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_authorize_remote_start: ERoamingAuthorizeRemoteStart,
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;MANDATORY&#x60;   * This operation is used by EMPs in order to remotely start a charging process  The service that is offered by Hubject in order to allow customers to directly start a charging process via mobile app.  ![Remote start diagram](images/remotestart.png)   __Functional Description:__  __Scenario:__  A customer of an EMP wants to charge a vehicle at a charging station of a CPO. The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application. The EMP’s provider system can then initiate a charging process at the CPO’s charging station by sending an eRoamingAuthorizeRemoteStart request to Hubject. The request &#x60;MUST&#x60; contain the ProviderID and the EvseID.  Hubject will derive the CPO’s OperatorID from the EvseID.  Hubject will check whether there is a valid contract between the two partners for the service (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.  In case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the following process and forwards the request (including the SessionID) to the CPO. The CPO &#x60;MUST&#x60; return an eRoamingAcknowledgement message that &#x60;MUST&#x60; contain the result indicating whether the charging process will be started and that &#x60;MAY&#x60; contain a status code for further information.  In case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error.  Best Practices:   * Please ensure a request run time of under 10 seconds including network roundtrip. """
        ...


    async def e_roaming_authorize_remote_stop_v2_1(
        self,
        externalID: Annotated[StrictStr, Field(description="external id")],
        e_roaming_authorize_remote_stop: ERoamingAuthorizeRemoteStop,
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;MANDATORY&#x60;  ![Remote stop diagram](images/remotestop.png)  eRoamingAuthorizeRemoteStop basically works in the same way as eRoamingAuthorizeRemoteStart. The only difference is that this request is sent in order to initiate the stopping of a charging process. The request &#x60;MUST&#x60; contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteStart request. """
        ...


    async def e_roaming_authorize_start_v2_1(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_authorize_start: ERoamingAuthorizeStart,
    ) -> ERoamingAuthorizationStart:
        """__Note:__   * To &#x60;RECEIVE&#x60;   * Implementation: &#x60;MANDATORY&#x60;  __Functional Description:__  Scenario:  A customer of an EMP wants to charge a vehicle at a charging point of a CPO. The customer authenticates at the charging point. The CPO’s operator system does not recognize the customer’s authentication data. In order to authorize the charging process, the CPO’s system can send an eRoamingAuthorizeStart request to Hubject. The request MUST contain the OperatorID and the identification data (e.g. UID or EvcoID) and MAY contain the EvseID.  Hubject generates a SessionID for the charging process and persists important session data (SessionID, EvseID, identification data).  Regarding the further service processing, there are three different options:  a. Hubject first tries to authorize the customer offline by checking authentication master data. Authentication data can be uploaded by EMPs using the eRoamingAuthenticationData service. ![Authorize Start offline diagram](images/authorizestart_offline.png)  b. In case offline authorization is not possible, Hubject tries to derive the EMP from the provided identification data. QR Code and Plug&amp;Charge identification data contain the EvcoID. Hubject can derive the EMP’s ProviderID from the EvcoID. Hubject will directly forward eRoamingAuthorizeStart requests to the EMP. The EMP provider system checks the requested authentication data and responds accordingly, either by authorizing or not authorizing the request. The response &#x60;MUST&#x60; contain the ProviderID and the AuthorizationStatus and &#x60;MAY&#x60; contain a list of identification data that is authorized to stop the charging process. In case that the EMP provider system cannot be addressed (e.g. due to technical problems), the corresponding provider will be dealt with as if responding “NotAuthorized”. ![Authorize evco diagram](images/authorize_evco.png)  c. In case that Hubject cannot derive the EMP from the identification data (e.g. with RFID identification), Hubject identifies all EMPs that are under contract with the CPO (EMPs must be the service subscriber) and forwards the eRoamingAuthorizeStart request to all these EMPs (broadcast). Hubject consolidates all EMP responses and creates an overall response, authorizing the request in case that one EMP authorized the request.  ![Authorize Start online diagram](images/authorizestart_online.png)  In case that the request for authorization was not successful, Hubject deletes the corresponding SessionID for the charging process.  The response from Hubject to the CPO contains authorization details and in case of successful authorization the created SessionID and the ProviderID of the authorizing provider. """
        ...


    async def e_roaming_authorize_stop_v2_1(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_authorize_stop: ERoamingAuthorizeStop,
    ) -> ERoamingAuthorizationStop:
        """__Note:__   * To &#x60;RECEIVE&#x60;   * Implementation: &#x60;OPTIONAL&#x60;  ![Authorize stop diagram](images/authorizestop.png)  eRoamingAuthorizeStop basically works in a similar way to the operation eRoamingAuthorizeStart. The request is sent in order to authorize the stopping of a charging process. The request &#x60;MUST&#x60; contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeStart request. In most cases, Hubject can derive the EMP that authorized the charging process from the SessionID and can directly and offline authorize the request or forward the request for stopping to the EMP. In case the charging session was originally authorized offline by the HBS, the session &#x60;MUST&#x60; only be stopped with the same medium, which was used for starting the session """
        ...


    async def e_roaming_charge_detail_record_v2_2(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_charge_detail_record: ERoamingChargeDetailRecord,
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;RECEIVE&#x60;   * Implementation: &#x60;MANDATORY&#x60;  ![Charge Detail Record diagram](images/cdr.png)  __Functional Description:__  Scenario:  A customer of an EMP has charged a vehicle at a charging station of a CPO. The charging process was started with an eRoamingAuthorizeStart or an eRoamingAuthorizeRemoteStart operation. The process may have been stopped with an eRoamingAuthorizeStop or an eRoamingAuthorizeRemoteStop operation. A preceding stop request is not a necessary precondition for the processing of an eRoamingChargeDetailRecord request. The CPO’s provider system &#x60;MUST&#x60; send an eRoamingChargeDetailRecord (CDR) after the end of the charging process in order to inform the EMP of the charging session data (e.g. meter values and consumed energy) and further charging process details.  Note:  The CPO &#x60;MUST&#x60; provide the same SessionID that was assigned to the corresponding charging process. Based on this information Hubject will be able to assign the session data to the correct process.  Hubject will identify the receiving EMP and will forward the CDR to the corresponding EMP. The EMP &#x60;MUST&#x60; return an eRoamingAcknowledgement message that &#x60;MUST&#x60; contain the result indicating whether the session data was received successfully and that &#x60;MAY&#x60; contain a status code for further information.  Hubject will accept only one CDR per SessionID.  In addition to forwarding the CDR to the EMP, Hubject also stores the CDR. In case that the recipient provider’s system cannot be addressed (e.g. due to technical problems), Hubject will nevertheless return to the requestor a positive result provided that storing the CDR was successful. """
        ...


    async def e_roaming_get_charge_detail_records_v2_2(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_get_charge_detail_records: ERoamingGetChargeDetailRecords,
    ) -> ERoamingChargeDetailRecords:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: EMP Online &#x60;OPTIONAL&#x60;, EMP Offline &#x60;MANDATORY&#x60;  ![Get Charge Detail Records diagram](images/getcdr.png)  The operation allows EMPs to download CDRs that have been sent to Hubject by partner CPOs. This means if for example Hubject was unable to forward a CDR from a CPO to an EMP due to technical problems in the EMP’s backend, the EMP will still have the option of obtaining these CDRs. The EMP &#x60;MUST&#x60; specify a date range in the request. Hubject will return a list of all CDRs received by the HBS within the specified date range for the requesting EMP (i.e. all CDRs within the date range where the corresponding charging process was authorized by the EMP or authorized by Hubject based on the EMP’s authentication data.  Hubject does not check whether a requested CDR has already been provided to the requesting EMP in the past.  Pagination:  Starting from OICP 2.3, eRoaminGetChargeDetailRecords uses pagination. This is an implementation that EMPs &#x60;MUST&#x60; use in order to divide the amount of ChargeDetailRecords contained in the response of the pull request.  The parameters of the pagination are given at the end of the end point: &#x60;…​?page&#x3D;0&amp;size&#x3D;20&#x60; where &#x60;page&#x60; indicates the number of the page for the response and &#x60;size&#x60; the amount of records to be provided in the response.  Example:  Using OICP 2.3 GetChargeDetailRecords endpoint for PROD environment:  https://service.hubject.com/api/oicp/cdrmgmt/v22/providers/{providerID}/get-charge-detail-records-request?page&#x3D;0&amp;size&#x3D;1500  In the previous request we are telling to provide page __0__ with __1500__ records in it.  Important  The default number of records provided in the response are __20__ elements and the maximum number of records possible to obtain per page are __2000__. """
        ...
