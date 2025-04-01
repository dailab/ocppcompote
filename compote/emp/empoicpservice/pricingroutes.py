from datetime import datetime

import httpx
from fastapi import APIRouter, Body, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.eroaming.models.e_roaming_evse_pricing import ERoamingEVSEPricing
from compote.eroaming.models.e_roaming_pricing_product_data import \
    ERoamingPricingProductData
from compote.eroaming.models.e_roaming_pull_evse_pricing import ERoamingPullEVSEPricing
from compote.eroaming.models.e_roaming_pull_pricing_product_data import \
    ERoamingPullPricingProductData

router = APIRouter()
providerId = "DE-DCB"

DEFAULT_PRICING_PRODUCT_DATA = ERoamingPullPricingProductData(
    LastCall="2020-09-23T14:33:42.246Z",
    OperatorIDs=["DE*ABC"]
)

DEFAULT_PRICING_EVSE_DATA = ERoamingPullEVSEPricing(
    LastCall="2020-09-23T14:33:42.246Z",
    OperatorIDs=["DE*ABC"],
    ProviderID=providerId
)

@router.post("/pullpricingproductdatav10", tags=["EMP OICP Client API"])
async def eRoamingPullPricingProductData_V10(
        providerID: str = providerId,
        body: ERoamingPullPricingProductData = Body(default=DEFAULT_PRICING_PRODUCT_DATA),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingPricingProductData:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`

      When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of pricing product data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid pricing products data available in the HBS for the requesting EMP (and pushed by CPOs whose OperatorIDs are supplied in the request) are grouped by OperatorID and sent in response to the request.

      The operation also allows the use of the LastCall filter. When the LastCall filter is used, only pricing product data changes that have taken place after the date/time value provided in the “LastCall&quot; field of the request are sent to the EMP.

    """  # noqa

    if not body:
        request = ERoamingPullPricingProductData(
            ProviderID = providerID or context.data["providerId"],
            OperatorIDs = ["DE*ABC"]
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context.currentrequest = payload

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/dynamicpricing/v10/providers/{context.data['providerId']}/pricing-products"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.data["pricing_product_data"].append(response.json())
    context.currentresponse = response.json()
    return response.json()

@router.post("/pullevsepricingv10", tags=["EMP OICP Client API"])
async def eRoamingPullEVSEPricing_V10(
        providerID: str = providerId,
        body: ERoamingPullEVSEPricing = Body(default=DEFAULT_PRICING_EVSE_DATA),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingEVSEPricing:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`

    When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of EVSE pricing data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid EVSE pricing data available in the HBS for the requesting EMP are grouped by OperatorID and sent in response to the request.

    The operation also allows the use of the LastCall filter. When the LastCall filter is used, only EVSE pricing data changes that have taken place after the date/time value provided in the “LastCall&quot; field of the request are sent to the EMP.

    """  # noqa

    if not body:
        request = ERoamingPullEVSEPricing(
            ProviderID = providerID or context.data["providerId"],
            OperatorIDs = ["DE*ABC"]
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context.currentrequest = payload

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/dynamicpricing/v10/providers/{context.data['providerId']}/evse-pricing"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.data["evse_pricing"].append(response.json())
    context.currentresponse = response.json()
    return response.json()