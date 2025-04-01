
from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_dynamic_pricing_api_base import \
    BaseERoamingDynamicPricingApi
from compote.eroaming.context.eroaming_context import ERoamingContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_evse_pricing import ERoamingEVSEPricing
from compote.eroaming.models.e_roaming_pricing_product_data import ERoamingPricingProductData
from compote.eroaming.models.e_roaming_pull_evse_pricing import ERoamingPullEVSEPricing
from compote.eroaming.models.e_roaming_pull_pricing_product_data import ERoamingPullPricingProductData
from compote.eroaming.models.e_roaming_push_evse_pricing import ERoamingPushEVSEPricing
from compote.eroaming.models.e_roaming_push_pricing_product_data import ERoamingPushPricingProductData


class BaseERoamingDynamicPricingApiImpl(BaseERoamingDynamicPricingApi):

    evse_pricing = []
    product_data_pricing = []

    def __init__(self):
        super()

    async def e_roaming_pull_evse_pricing_v1_0(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_pricing: ERoamingPullEVSEPricing,
        context: ERoamingContext
    ) -> ERoamingEVSEPricing:


        testdata = {
          "EVSEPricing": [
            {
              "EVSEPricing": self.evse_pricing,
              "OperatorID": "DE*ABC",
              "OperatorName": "ABC technologies"
            }
          ],
          "StatusCode": {
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "string"
          }
        }

        return ERoamingEVSEPricing.parse_obj(testdata)

    async def e_roaming_pull_pricing_product_data_v1_0(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_pricing_product_data: ERoamingPullPricingProductData,
        context: ERoamingContext
    ) -> ERoamingPricingProductData:

        testdata = {
          "PricingProductData": [
            {
              "OperatorID": "+49*536",
              "OperatorName": "string",
              "ProviderID": "DE-8EO",
              "PricingDefaultPrice": 0,
              "PricingDefaultPriceCurrency": "EUR",
              "PricingDefaultReferenceUnit": "HOUR",
              "PricingProductDataRecords": [
                {
                  "ProductID": "AC1",
                  "ReferenceUnit": "HOUR",
                  "ProductPriceCurrency": "EUR",
                  "PricePerReferenceUnit": 0,
                  "MaximumProductChargingPower": 0,
                  "IsValid24hours": True,
                  "ProductAvailabilityTimes": [
                    {
                      "Periods": [
                        {
                          "begin": "00:00",
                          "end": "00:00"
                        }
                      ],
                      "on": "Everyday"
                    }
                  ],
                  "AdditionalReferences": [
                    {
                      "AdditionalReference": "START FEE",
                      "AdditionalReferenceUnit": "HOUR",
                      "PricePerAdditionalReferenceUnit": 0
                    }
                  ]
                }
              ]
            }
          ],
          "StatusCode": {
            "Code": "000",
            "Description": "Success",
            "AdditionalInfo": "Success"
          }
        }

        return ERoamingPricingProductData.parse_obj(testdata)


    async def e_roaming_push_evse_pricing_v1_0(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_push_evse_pricing: ERoamingPushEVSEPricing,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        self.evse_pricing = e_roaming_push_evse_pricing.evse_pricing[0].dict(by_alias=True, exclude_none=True)

        testdata = {
          "Result": True,
          "StatusCode": {
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Success"
          },
          "SessionID": "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
          "CPOPartnerSessionID": "1234XYZ",
          "EMPPartnerSessionID": "2345ABC"
        }

        return ERoamingAcknowledgment.parse_obj(testdata)


    async def e_roaming_push_pricing_product_data_v1_0(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_push_pricing_product_data: ERoamingPushPricingProductData,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        testdata = {
          "Result": True,
          "StatusCode": {
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Success"
          },
          "SessionID": "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
          "CPOPartnerSessionID": "1234XYZ",
          "EMPPartnerSessionID": "2345ABC"
        }

        return ERoamingAcknowledgment.parse_obj(testdata)
