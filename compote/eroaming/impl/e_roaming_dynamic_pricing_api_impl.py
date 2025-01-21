# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_dynamic_pricing_api_base import \
    BaseERoamingDynamicPricingApi
from compote.eroaming.models.e_roaming_evse_pricing import ERoamingEVSEPricing
from compote.eroaming.models.e_roaming_pricing_product_data import ERoamingPricingProductData
from compote.eroaming.models.e_roaming_pull_evse_pricing import ERoamingPullEVSEPricing
from compote.eroaming.models.e_roaming_pull_pricing_product_data import ERoamingPullPricingProductData


class BaseERoamingDynamicPricingApiImpl(BaseERoamingDynamicPricingApi):

    def __init__(self):
        super()

    async def e_roaming_pull_evse_pricing_v1_0(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_pricing: ERoamingPullEVSEPricing,
    ) -> ERoamingEVSEPricing:

        testdata = {
          "EVSEPricing": [
            {
              "EVSEPricing": [
                {
                  "EvseID": "DE*XYZ*ETEST1",
                  "EvseIDProductList": [
                    "AC 1"
                  ],
                  "ProviderID": "DE-DCB"
                }
              ],
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