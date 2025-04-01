# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.context.eroaming_context import ERoamingContext
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_pull_evse_status_v21200_response import ERoamingPullEvseStatusV21200Response
from compote.eroaming.models.e_roaming_pull_evse_status_v21_request import ERoamingPullEvseStatusV21Request
from compote.eroaming.models.e_roaming_push_evse_status import ERoamingPushEvseStatus


class BaseERoamingEvseStatusApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseERoamingEvseStatusApi.subclasses = BaseERoamingEvseStatusApi.subclasses + (cls,)
    async def e_roaming_pull_evse_status_v2_1(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_status_v21_request: ERoamingPullEvseStatusV21Request,
        context: ERoamingContext
    ) -> ERoamingPullEvseStatusV21200Response:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;Mandatory&#x60;  ![Pull EVSE status](images/pullevsestatus.png)      When an EMP sends an eRoamingPullEVSEStatus request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSE status data from Hubject. When an EMP sends an eRoamingPullEVSEStatus request, Hubject identifies all currently valid EVSE status records of all operators.  Hubject groups all resulting EVSE status records according to the related CPO. The response structure contains an “EvseStatuses” node that envelopes an “OperatorEVSEStatus” node for every CPO with currently valid and accessible status data records. """
        ...

    async def e_roaming_push_evse_status_v2_1(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_push_evse_status: ERoamingPushEvseStatus,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;Mandatory&#x60;  ![Push EVSE status](images/pushevsestatus.png)  When a CPO sends an eRoamingPushEvseStatus request, Hubject checks whether there is a valid contract between Hubject and the CPO for the service type (Hubject must be the subscriber). If so, the operation allows uploading EVSE status data to Hubject. Furthermore, it is possible to update EVSE status data that has been pushed with an earlier operation request.  The way how Hubject handles the transferred data &#x60;MUST&#x60; be defined in the request field \&quot;ActionType2, which offers four options. This option works in the same way as the eRoamingAuthenticationData service. The EVSE status data that will be inserted or updated MUST be provided with the field “OperatorEvseStatus”, which consists of “EvseStatusRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EVSE status data for every point in time in the past.  Note:  The eRoamingPushEvseStatus operation &#x60;MUST&#x60; always be used sequentiallyas described in Data Push Operations  Best Practices:  Please try to avoid race conditions by sending multiple status simultaneously. Status should be sent one by one. """
        ...
