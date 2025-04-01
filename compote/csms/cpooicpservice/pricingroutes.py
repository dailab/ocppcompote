from datetime import datetime

import httpx
from fastapi import APIRouter, Body, Depends

from compote.csms.context.csms_contextmanager import ContextManager, get_shared_context_manager
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_pricing_product_data import \
    ERoamingPricingProductData
from compote.eroaming.models.e_roaming_push_evse_pricing import ERoamingPushEVSEPricing
from compote.eroaming.models.e_roaming_push_pricing_product_data import ERoamingPushPricingProductData

router = APIRouter()

DEFAULT_PRICING_PRODUCT_DATA = ERoamingPushPricingProductData(
  ActionType = "fullLoad",
  PricingProductData = {
    "OperatorID": "DE*ABC",
    "OperatorName": "ABC technologies",
    "PricingDefaultPrice": 0,
    "PricingDefaultPriceCurrency": "EUR",
    "PricingDefaultReferenceUnit": "HOUR",
    "PricingProductDataRecords": [
      {
        "AdditionalReferences": [
          {
            "AdditionalReference": "PARKING FEE",
            "AdditionalReferenceUnit": "HOUR",
            "PricePerAdditionalReferenceUnit": 2
          }
        ],
        "IsValid24hours": False,
        "MaximumProductChargingPower": 22,
        "PricePerReferenceUnit": 1,
        "ProductAvailabilityTimes": [
          {
            "Periods": [
              {
                "begin": "09:00",
                "end": "18:00"
              }
            ],
            "on": "Everyday"
          }
        ],
        "ProductID": "AC 1",
        "ProductPriceCurrency": "EUR",
        "ReferenceUnit": "HOUR"
      }
    ],
    "ProviderID": "*"
  }
)

DEFAULT_PRICING_EVSE_DATA = ERoamingPushEVSEPricing(
  ActionType = "fullLoad",
  EVSEPricing = [
    {
      "EvseID": "DE*XYZ*ETEST1",
      "EvseIDProductList": [
        "AC 1"
      ],
      "ProviderID": "*"
    }
  ]
)

@router.post("/pushpricingproductdatav10", tags=["CPO OICP Client API"])
async def eRoamingPushPricingProductData_V10(
        operatorID: str,
        body: ERoamingPushPricingProductData = Body(default=DEFAULT_PRICING_PRODUCT_DATA),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`

      When a CPO sends an eRoamingPushPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing service offer (for the service type Authorization) created by the CPO. If so, the operation allows the upload of pricing product data to Hubject. In addition, it is also possible to update or delete pricing data previously pushed with an upload operation request. How the transferred data is to be processed `MUST` be defined in the “ActionType” field of the request. Four processing options (i.e. Action Types) exist, details of which can be seen in eRoamingPushPricingProductData message

      The pricing product data to be processed `MUST` be provided in the “PricingProductData” field, which consists of “PricingProductDataRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of pricing data for every point in time in the past.

    """  # noqa

    if not body:
        request = ERoamingPushPricingProductData(
            ActionType="fullLoad",
            PricingProductData = ERoamingPricingProductData.parse_obj(context_manager.data["product_pricing_data"])
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context_manager.currentrequest = payload

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/dynamicpricing/v10/operators/{context_manager.config['operatorId']}/pricing-products"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.currentresponse = response.json()

    return response.json()

@router.post("/pushevsepricingv10", tags=["CPO OICP Client API"])
async def eRoamingPushEVSEPricing_V10(
        operatorID: str,
        body: ERoamingPushEVSEPricing = Body(default=DEFAULT_PRICING_EVSE_DATA),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`
    When a CPO sends an eRoamingPushEVSEPricing request, Hubject checks whether there is a valid flexible/dynamic pricing service offer (for the service type Authorization) created by the CPO. If so, the operation allows the upload of a list containing pricing product assignment to EvseIDs to Hubject. In addition, it is also possible to update or delete EVSE pricing data previously pushed with an upload operation request. How the transferred data is to be processed `MUST` be defined in the “ActionType” field of the request. Four processing options (i.e. Action Types) exist, details of which can be seen in section eRoamingPushEVSEPricing).

    The EVSE pricing data to be processed `MUST` be provided in the “EVSEPricing” field, which consists of “EvseIDProductList” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EVSE pricing data for every point in time in the past.

    EVSE consistency:

    EvseIDs contain the ID of the corresponding CPO (With every EVSE pricing data upload operation, Hubject checks whether the given CPO’s OperatorID or Sub-OperatorIDs if necessary) matches every given EvseID sent in the request. If not, Hubject refuses the data upload and responds with the status code 018.

    Note

    The eRoamingPushEVSEPricing operation `MUST` always be used sequentially.

    """  # noqa

    if not body:
        request = ERoamingPushEVSEPricing(
            ActionType="fullLoad",
            EVSEPricing = context_manager.data["evse_pricing_data"],
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context_manager.currentrequest = payload

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/dynamicpricing/v10/operators/{context_manager.config['operatorId']}/evse-pricing"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.currentresponse = response.json()

    return response.json()