# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.context.eroaming_context import ERoamingContext
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_evse_pricing import ERoamingEVSEPricing
from compote.eroaming.models.e_roaming_pricing_product_data import ERoamingPricingProductData
from compote.eroaming.models.e_roaming_pull_evse_pricing import ERoamingPullEVSEPricing
from compote.eroaming.models.e_roaming_pull_pricing_product_data import ERoamingPullPricingProductData
from compote.eroaming.models.e_roaming_push_evse_pricing import ERoamingPushEVSEPricing
from compote.eroaming.models.e_roaming_push_pricing_product_data import ERoamingPushPricingProductData


class BaseERoamingDynamicPricingApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseERoamingDynamicPricingApi.subclasses = BaseERoamingDynamicPricingApi.subclasses + (cls,)
    async def e_roaming_pull_evse_pricing_v1_0(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_pricing: ERoamingPullEVSEPricing,
        context: ERoamingContext
    ) -> ERoamingEVSEPricing:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;  When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of EVSE pricing data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid EVSE pricing data available in the HBS for the requesting EMP are grouped by OperatorID and sent in response to the request.  The operation also allows the use of the LastCall filter. When the LastCall filter is used, only EVSE pricing data changes that have taken place after the date/time value provided in the “LastCall\&quot; field of the request are sent to the EMP. """
        ...


    async def e_roaming_pull_pricing_product_data_v1_0(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_pricing_product_data: ERoamingPullPricingProductData,
        context: ERoamingContext
    ) -> ERoamingPricingProductData:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;      When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of pricing product data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid pricing products data available in the HBS for the requesting EMP (and pushed by CPOs whose OperatorIDs are supplied in the request) are grouped by OperatorID and sent in response to the request.    The operation also allows the use of the LastCall filter. When the LastCall filter is used, only pricing product data changes that have taken place after the date/time value provided in the “LastCall\&quot; field of the request are sent to the EMP. """
        ...


    async def e_roaming_push_evse_pricing_v1_0(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_push_evse_pricing: ERoamingPushEVSEPricing,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60; When a CPO sends an eRoamingPushEVSEPricing request, Hubject checks whether there is a valid flexible/dynamic pricing service offer (for the service type Authorization) created by the CPO. If so, the operation allows the upload of a list containing pricing product assignment to EvseIDs to Hubject. In addition, it is also possible to update or delete EVSE pricing data previously pushed with an upload operation request. How the transferred data is to be processed &#x60;MUST&#x60; be defined in the “ActionType” field of the request. Four processing options (i.e. Action Types) exist, details of which can be seen in section eRoamingPushEVSEPricing).  The EVSE pricing data to be processed &#x60;MUST&#x60; be provided in the “EVSEPricing” field, which consists of “EvseIDProductList” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EVSE pricing data for every point in time in the past.  EVSE consistency:  EvseIDs contain the ID of the corresponding CPO (With every EVSE pricing data upload operation, Hubject checks whether the given CPO’s OperatorID or Sub-OperatorIDs if necessary) matches every given EvseID sent in the request. If not, Hubject refuses the data upload and responds with the status code 018.  Note  The eRoamingPushEVSEPricing operation &#x60;MUST&#x60; always be used sequentially. """
        ...


    async def e_roaming_push_pricing_product_data_v1_0(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_push_pricing_product_data: ERoamingPushPricingProductData,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:
        """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;    When a CPO sends an eRoamingPushPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing service offer (for the service type Authorization) created by the CPO. If so, the operation allows the upload of pricing product data to Hubject. In addition, it is also possible to update or delete pricing data previously pushed with an upload operation request. How the transferred data is to be processed &#x60;MUST&#x60; be defined in the “ActionType” field of the request. Four processing options (i.e. Action Types) exist, details of which can be seen in eRoamingPushPricingProductData message    The pricing product data to be processed &#x60;MUST&#x60; be provided in the “PricingProductData” field, which consists of “PricingProductDataRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of pricing data for every point in time in the past. """
        ...