# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from compote.eroaming.apis.e_roaming_dynamic_pricing_api_base import BaseERoamingDynamicPricingApi
import compote.eroaming.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from compote.eroaming.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_evse_pricing import ERoamingEVSEPricing
from compote.eroaming.models.e_roaming_pricing_product_data import ERoamingPricingProductData
from compote.eroaming.models.e_roaming_pull_evse_pricing import ERoamingPullEVSEPricing
from compote.eroaming.models.e_roaming_pull_pricing_product_data import ERoamingPullPricingProductData


router = APIRouter()

ns_pkg = compote.eroaming.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/dynamicpricing/v10/providers/{providerID}/evse-pricing",
    responses={
        200: {"model": ERoamingEVSEPricing, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingDynamicPricing"],
    summary="eRoamingPullEVSEPricing_V1.0",
    response_model_by_alias=True,
)
async def e_roaming_pull_evse_pricing_v1_0(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_pull_evse_pricing: ERoamingPullEVSEPricing = Body(None, description=""),
) -> ERoamingEVSEPricing:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;  When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of EVSE pricing data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid EVSE pricing data available in the HBS for the requesting EMP are grouped by OperatorID and sent in response to the request.  The operation also allows the use of the LastCall filter. When the LastCall filter is used, only EVSE pricing data changes that have taken place after the date/time value provided in the “LastCall\&quot; field of the request are sent to the EMP. """
    if not BaseERoamingDynamicPricingApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingDynamicPricingApi.subclasses[0]().e_roaming_pull_evse_pricing_v1_0(providerID, e_roaming_pull_evse_pricing)


@router.post(
    "/dynamicpricing/v10/providers/{providerID}/pricing-products",
    responses={
        200: {"model": ERoamingPricingProductData, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingDynamicPricing"],
    summary="eRoamingPullPricingProductData_V1.0",
    response_model_by_alias=True,
)
async def e_roaming_pull_pricing_product_data_v1_0(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_pull_pricing_product_data: ERoamingPullPricingProductData = Body(None, description=""),
) -> ERoamingPricingProductData:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;      When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of pricing product data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid pricing products data available in the HBS for the requesting EMP (and pushed by CPOs whose OperatorIDs are supplied in the request) are grouped by OperatorID and sent in response to the request.    The operation also allows the use of the LastCall filter. When the LastCall filter is used, only pricing product data changes that have taken place after the date/time value provided in the “LastCall\&quot; field of the request are sent to the EMP. """
    if not BaseERoamingDynamicPricingApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingDynamicPricingApi.subclasses[0]().e_roaming_pull_pricing_product_data_v1_0(providerID, e_roaming_pull_pricing_product_data)
