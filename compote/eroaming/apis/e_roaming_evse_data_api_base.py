# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_evse_data import ERoamingEVSEData
from compote.eroaming.models.e_roaming_pull_evse_data import ERoamingPullEVSEData


class BaseERoamingEvseDataApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseERoamingEvseDataApi.subclasses = BaseERoamingEvseDataApi.subclasses + (cls,)
    async def e_roaming_pull_evse_data_v2_3(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_data: ERoamingPullEVSEData,
    ) -> ERoamingEVSEData:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;MANDATORY&#x60;  ![Pull evse data diagram](images/pullevsedata.png)  When an EMP sends an eRoamingPullEVSEData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSEData from Hubject. When an EMP sends an eRoamingPullEVSEData request, Hubject identifies all currently valid EVSEData records of all operators.  For every EVSE data record Hubject identifies the timestamp of the last update, which has been performed on the record. The timestamp is returned with the attribute “lastUpdate”.  __Delta pull:__  As mentioned above, the operation by default returns all currently valid EVSE data records. However, the requesting EMP has the possibility to download only the changes (delta) compared to a certain time in the past. In order to do so, the EMP MUST provide the optional date/time field “LastCall”, indicating his last EVSE pull request. In case that Hubject receives the LastCall parameter, Hubject compares the EVSE records from the time of the last call with the currently valid records. As a result, Hubject assigns the attribute “deltaType” (possible values: insert, update, delete) to every response EVSE data record indicating whether the particular record has been inserted, updated or deleted in the meantime. EVSE data records that have not changed will not be part of the response.  Note: * The delta pull option cannot be combined with radial search, because in some cases this could lead to data inconsistency on the EMP’s side. This is why the API only allows the provision of either the attribute “SearchCenter” or “LastCall”.  __Pagination:__  Starting from OICP 2.3, eRoamingPullEvseData uses pagination. This is an implementation that EMPs &#x60;MUST&#x60; use in order to divide the amount of EvseDataRecords contained in the response of the pull request.  The parameters of the pagination are given at the end of the end point: &#x60;…​?page&#x3D;0&amp;size&#x3D;20&#x60; where &#x60;page&#x60; indicates the number of the page for the response and &#x60;size&#x60; the amount of records to be provided in the response.  Important: * __The default number of records provided in the eRoamingEvseData response is 20 elements.__ """
        ...
