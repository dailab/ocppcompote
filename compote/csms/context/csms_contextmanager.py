import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional

from compote.csms.context.csms_context import Context
from compote.csms.cpooicpservice.chargingnotifications import eRoamingChargingNotifications_V11
from compote.csms.processors.reservations.cancel_reservation import OCPP16CancelReservationProcessor, \
    OCPP20CancelReservationProcessor
from compote.csms.processors.reservations.reserve_now import OCPP16ReserveNowProcessor, OCPP20ReserveNowProcessor
from compote.csms.processors.transactions.remote_start_transaction import OCPP20RemoteStartTransactionProcessor, \
    OCPP16RemoteStartTransactionProcessor
from compote.csms.processors.transactions.remote_stop_transaction import OCPP16RemoteStopTransactionProcessor, \
    OCPP20RemoteStopTransactionProcessor
from compote.eroaming.models.e_roaming_charging_notification_end import ERoamingChargingNotificationEnd
from compote.eroaming.models.e_roaming_charging_notification_progress import ERoamingChargingNotificationProgress
from compote.eroaming.models.e_roaming_charging_notification_start import ERoamingChargingNotificationStart
from compote.shared.dataclasses import AuthIdTag
from compote.shared.helper_functions import log_tail, log_json

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_contextmanager')


class ContextManager:
    """
    Class used to represent charging station management system state.
    """

    wshandler_config = None
    webservice_config = None
    contexts = None
    config = None
    cp_defaults = None
    auth_id_tags: dict = None
    data: dict = None

    def __init__(self, config = None, logfile_name = None):
        self.config = config
        self.wshandler_config = config["wshandler_config"]
        self.cp_defaults = config["cp_defaults"]
        self.webservice_config = config["webservice_config"]
        self.auth_id_tags = config["auth_id_tags"]
        self.logfile_name = logfile_name
        self.contexts = list()
        self.data = dict(
            {
                "config": {
                        "oicp_server_config": {
                            "OICP_SERVER_URL": "http://127.0.0.1:8002/oicp"
                            }
                        },
                "root": {},
                "charging_notifications": [],
                "authorizations": [],
                "remote_authorizations": [],
                "remote_reservations": [],
                "cdrs": [],
                "cs_data": [],
                "cs_status_data": [],
                "pricing_product_data": [],
                "evse_pricing": [],
                "authentication_data_records": [],
                "evse_id_cs_mapping":
                    [
                        {
                            "CP_Identity_0": "DE*XYZ*ETEST1"
                        },
                        {
                            "CP_Identity_1": "DE*XYZ*ETEST2"
                        }
                        # TODO handle identity aliases
                        # {
                        #     "cp001cs001": "DE*XYZ*ETEST1"
                        # },
                        # {
                        #     "cp001": "DE*XYZ*ETEST1"
                        # },
                        # {
                        #     "cs001": "DE*XYZ*ETEST1"
                        # }
                    ],
                "existing_cs_data":
                    [
                        {
                            "Accessibility": "Restricted access",
                            "AccessibilityLocation": "ParkingGarage",
                            "AdditionalInfo": [
                                {
                                    "lang": "en",
                                    "value": "This charging station is for testing purposes"
                                }
                            ],
                            "Address": {
                                "City": "Berlin",
                                "Country": "DEU",
                                "Floor": "6OG",
                                "HouseNum": "22",
                                "PostalCode": "10829",
                                "Region": "Berlin",
                                "Street": "EUREF CAMPUS",
                                "TimeZone": "UTC+01:00",
                                "ParkingFacility": True,
                                "ParkingSpot": "E36"
                            },
                            "AuthenticationModes": [
                                "NFC RFID Classic",
                                "REMOTE"
                            ],
                            "CalibrationLawDataAvailability": "Local",
                            "ChargingFacilities": [
                                {
                                    "Amperage": 32,
                                    "Power": 22,
                                    "PowerType": "AC_3_PHASE",
                                    "Voltage": 480,
                                    "ChargingModes": [
                                        "Mode_4"
                                    ]
                                }
                            ],
                            "ChargingPoolID": "DE*ABC*P1234TEST*1",
                            "ChargingStationID": "TEST 1",
                            "ChargingStationImage": "http://www.testlink.com",
                            "ChargingStationNames": [
                                {
                                    "lang": "en",
                                    "value": "ABC Charging Station Test"
                                },
                                {
                                    "lang": "de",
                                    "value": "ABC Testladestation"
                                }
                            ],
                            "ChargingStationLocationReference": [
                                {
                                    "lang": "en",
                                    "value": "Charging station is inside Hubject Office Parking Lot"
                                }
                            ],
                            "ClearinghouseID": "TEST ID",
                            "DynamicInfoAvailable": "true",
                            "DynamicPowerLevel": True,
                            "EvseID": "DE*XYZ*ETEST1",
                            "EnergySource": [
                                {
                                    "Energy": "Solar",
                                    "Percentage": 85
                                },
                                {
                                    "Energy": "Wind",
                                    "Percentage": 15
                                }
                            ],
                            "EnvironmentalImpact": {
                                "CO2Emission": 30.3
                            },
                            "GeoChargingPointEntrance": {
                                "Google": {
                                    "Coordinates": "52.480495 13.356465"
                                },
                                "DecimalDegree": {
                                    "Longitude": "13.356465",
                                    "Latitude": "52.480495"
                                }
                            },
                            "GeoCoordinates": {
                                "Google": {
                                    "Coordinates": "52.480495 13.356465"
                                },
                                "DecimalDegree": {
                                    "Longitude": "13.356465",
                                    "Latitude": "52.480495"
                                }
                            },
                            "HardwareManufacturer": "Charger Hardware Muster Company",
                            "HotlinePhoneNumber": "+49123123123123",
                            "HubOperatorID": "DE*ABC",
                            "IsHubjectCompatible": True,
                            "IsOpen24Hours": False,
                            "MaxCapacity": 50,
                            "OpeningTimes": [
                                {
                                    "Period": [
                                        {
                                            "begin": "09:00",
                                            "end": "18:00"
                                        }
                                    ],
                                    "on": "Everyday"
                                }
                            ],
                            "PaymentOptions": [
                                "No Payment"
                            ],
                            "Plugs": [
                                "Type 2 Outlet"
                            ],
                            "RenewableEnergy": True,
                            "SubOperatorName": "XYZ Technologies",
                            "ValueAddedServices": [
                                "Reservation"
                            ],
                            "deltaType": "insert",
                        }
                    ],
                "evse_status_data" :
                    [
                            {
                                "EvseID": "DE*XYZ*ETEST1",
                                "EvseStatus": "OutOfService"
                            }
                    ],
                "product_pricing_data" : {
                    "OperatorID": self.config["operatorId"],
                    "OperatorName": self.config["operatorName"],
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
                        "IsValid24hours": True,
                        "MaximumProductChargingPower": 22,
                        "PricePerReferenceUnit": 1,
                        "ProductAvailabilityTimes": [
                          {
                            "Periods": [
                              {
                                "begin": "00:00",
                                "end": "24:00"
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
                  },
                "evse_pricing_data" :  [
                    {
                      "EvseID": "DE*XYZ*ETEST1",
                      "EvseIDProductList": [
                        "AC 1"
                      ],
                      "ProviderID": "*"
                    }
                  ]
            }
        )

        self.currentresponse = {}
        self.currentrequest = {}

        self.data["startup"] = str(datetime.utcnow())

    async def dispatch_push_evse_data(self):
        # TODO fix local import
        from compote.csms.cpooicpservice.evsestatusroutes import eRoamingPushEvseData_V23
        await eRoamingPushEvseData_V23()

    async def dispatch_push_evse_status(self):
        # TODO fix local import
        from compote.csms.cpooicpservice.evsestatusroutes import eRoamingPushEvseStatus_V21
        await eRoamingPushEvseStatus_V21()

    async def add_context(self, context):
        """Add a new charging station context to the context manager
        Args:
            context (Context): csms context
        """
        self.contexts.append(context)

        message_type = "CSMS.ContextManager.Info"
        function = "AddChargingStation"
        arguments = {"cp_identity" : context.cp.id}
        msg = {"message_type": message_type, "function": function, "arguments": arguments}
        LOGGER.info(msg)

    async def detach_context(self, context):
        """Remove a charging station context from the context manager
        Args:
            context (Context): csms context
        """
        self.contexts.remove(context)

    async def register_new_cp_context(self, cp):
        """Register a new OCPP ChargePoint instance in the context manager
        Args:
            cp (ChargePoint): instance of the communication adapter
        """

        for item in self.contexts:
            if item.cp_data["id"] == cp.id:
                return item

        context = Context()
        await context.register_new_cp(cp, self, await self.get_cp_defaults(), await self.get_auth_id_tags())
        await self.add_context(context)

        return context

    async def get_contexts(self) -> List[Context]:
        """List all OCPP charging station contexts
        Returns:
            List[Context]: list of charging station contexts
        """
        return self.contexts

    async def get_context(self, id: int) -> Context:
        """Get charging station context based on its id
        Args:
            id (int): id of the context to get
        Returns:
            Context: a single charging station context
        """

        for context in self.contexts:
            if context.cp_data["id"] == id:
                return context

        #return await self.get_contexts()[id]

    async def delete_context(self, id: int):
        """Remove a charging station context from the context manager based on id
        Args:
            context (Context): csms context
        """
        del self.contexts[id]

    async def get_contexts_dict(self) -> dict:
        """Get a dictionary off all charging station contexts
        Returns:
            dict: a dictionary of charging station contexts
        """
        items: dict = {}
        contexts = await self.get_contexts()
        for i in range(len(contexts)):
            items[i] = await contexts[i].get_cp_data()
        return items

    async def get_context_manager_data(self) -> Dict:
        """Get the data of context manager
        Returns:
            Dict: dict of context manager data
        """
        return self.data

    async def set_wshandler_config(self, wshandler_config):
        """Set the configuration for the ocpp WebSocket handler
        Args:
            wshandler_config (dict): configuration for WebSocket adapter
        """
        self.wshandler_config = wshandler_config

    async def get_wshandler_config(self):
        """Get the configuration for the ocpp WebSocket handler
        Returns:
            dict: dictionary of the ocpp WebSocket handler configuration
        """
        return self.wshandler_config

    async def set_webservice_config(self, webservice_config):
        """Set the configuration for the webservice handler
        Args:
            webservice_config (dict): configuration for webservice adapter
        """
        self.webservice_config = webservice_config

    async def get_webservice_config(self):
        """Get the configuration for the webservice adapter
        Returns:
            dict: dictionary of the webservice adapter configuration
        """
        return self.webservice_config

    async def set_cp_defaults(self, cp_defaults):
        """Set the default values for new contexts
        Args:
            cp_defaults (dict): configuration for webservice adapter
        """
        self.cp_defaults = cp_defaults

    async def get_cp_defaults(self):
        """Get the default values for new contexts
        Returns:
            dict: dictionary of the default values
        """
        return self.cp_defaults

    async def get_auth_id_tags(self):
        """Get all authorization id tags registered in the csms
        Returns:
            dict: dictionary of the authorization id tags
        """
        return self.auth_id_tags

    async def get_data(self):
        """Get system operation data
        Returns:
            dict: dictionary of the system operation data
        """
        return self.data

    async def get_logfile_name(self):
        """Get the name of the current CSMS logfile
        Returns:
            str: name of the current CSMS logfile
        """
        return self.logfile_name

    async def get_logfile(self):
        """Get the current CSMS logfile
        Returns:
            List: list of the last entries of the current CSMS logfile
        """
        return await log_tail(await self.get_logfile_name())

    async def get_json_log(self):
        """Get a json array of entries of the current CSMS logfile
        Returns:
            List: list of the json objects of the current CSMS logfile
        """
        return await log_json(await self.get_logfile_name())

    async def get_log_by_uuid(self):
        results = {}
        entries = await log_json(await self.get_logfile_name())

        for entry in entries:
            arguments = entry.get("arguments", {})

            # Detect if actual uuid in send and receive ocpp messages
            if isinstance(arguments, List) and len(arguments) > 1:
                if arguments[0] <= 2:
                    results[arguments[1]] = []
                results[arguments[1]].append(entry)
            # Detect uuid in analytics processing message
            elif isinstance(arguments, Dict) and "uuid" in arguments:
                results[arguments["uuid"]].append(entry)

        return results

    async def get_config(self):
        """Get comprehensive configuration values
        Returns:
            dict: dictionary of the configuration values
        """
        return self.config

    async def set_config(self, config):
        """Set comprehensive configuration values for the csms
        Args:
            config (dict): dictionary of the configuration values
        """
        self.config = config

    async def add_auth_id(self, auth_id_tag: AuthIdTag):
        """Add a new AuthIdTag to the context manager of the csms
        Args:
            auth_id_tag (AuthIdTag): the authidtag to add
        """
        self.auth_id_tags.update({auth_id_tag.id : auth_id_tag})

    async def remove_auth_id(self, id: str):
        """Remove a AuthIdTag from the context manager of the csms
        Args:
            auth_id_tag (id): the authidtag to remove
        """
        return self.auth_id_tags.pop(id)

    async def update_evse_status(self, cp_identity, status):
        """Update the evse status
        """

        ocpp_status = status

        match ocpp_status:
            case "Available": oicp_status = "Available"
            case "Reserved": oicp_status = "Reserved"
            case "Unavailable": oicp_status = "OutOfService"
            case "Faulted": oicp_status = "OutOfService"
            case "Occupied": oicp_status = "Occupied"
            case "Preparing": oicp_status = "Occupied"
            case "Charging": oicp_status = "Occupied"
            case "Finishing": oicp_status = "Occupied"
            case "SuspendedEVSE": oicp_status = "Unknown"
            case "SuspendedEV": oicp_status = "Unknown"
            case _: oicp_status = "Unknown"

        # Match cp_identity to global evse_id
        # TODO Differentiate between Ids and individual connectors
        evse_id = None

        for item in self.data["evse_id_cs_mapping"]:
            for key in item.keys():
                if key == cp_identity:
                    evse_id = item[cp_identity]

        # Find correct evse_id and update status
        for item in self.data["evse_status_data"]:
            if item["EvseID"] == evse_id:
                item["EvseStatus"] = oicp_status

        return self.data


    async def dispatch_authorize_remote_start(self, evse_id, identification):
        # match evse_id to cp_identity
        cp_identity = None
        LOGGER.info("Dispatching Autorize Remote Start")
        remote_start_id = len(self.data["remote_authorizations"])

        for item in self.data["evse_id_cs_mapping"]:
            for key, value in item.items():
                if value == evse_id:
                    cp_identity = key

        # matching and mapping of identification
        context = await self.get_context(cp_identity)

        # derive id
        #id = identification.remote_identification.evco_id
        id = identification.rfid_mifare_family_identification.uid

        result = None
        # TODO currently connector_id is always assumed to be 0 / 1

        match context.cp_data["ocpp_version"]:
            case "1.6":
                # Map id_tag to 1.6
                id_tag = id
                result = await OCPP16RemoteStartTransactionProcessor().process(context=context, id_tag=id_tag, connector_id=1)
            case "2.0.1":
                # Map id_tag to 2.0.1
                id_token = {"id_token": id}
                result = await OCPP20RemoteStartTransactionProcessor().process(context=context, id_token=id_token, remote_start_id=remote_start_id, evse_id=1)

        return result

    async def dispatch_authorize_remote_stop(self, evse_id):

        cp_identity = None

        for item in self.data["evse_id_cs_mapping"]:
            for key, value in item.items():
                if value == evse_id:
                    cp_identity = key

        # matching and mapping of identification
        context = await self.get_context(cp_identity)

        transactions = context.cp_data["connectors"][0]["transactions"]
        transactions_length = len(transactions)
        transaction_id = transactions[transactions_length-1]["id"]

        # TODO Manual dispatch for specific transaction_ids
        #transaction_id = 1

        result = None

        # TODO currently connector_id is always assumed to be 0, allow flexible connector_ids
        match await context.get_ocpp_version():
            case "1.6":
                result = await OCPP16RemoteStopTransactionProcessor().process(context=context, transaction_id=transaction_id)
            case "2.0.1":
                result = await OCPP20RemoteStopTransactionProcessor().process(context=context, transaction_id=str(transaction_id))

        return result

    async def dispatch_authorize_remote_reservation_start(self, evse_id, identification):
        reservation_id = len(self.data["remote_reservations"])
        cp_identity = None

        for item in self.data["evse_id_cs_mapping"]:
            for key, value in item.items():
                if value == evse_id:
                    cp_identity = key

        if not cp_identity:
            return

        # matching and mapping of identification
        context = await self.get_context(cp_identity)

        # derive id
        # TODO support multiple types of identifications
        id = identification.rfid_mifare_family_identification.uid

        # Set expiry date to 1 hour from now
        current_datetime = datetime.utcnow()
        expiry_date = current_datetime + timedelta(hours=1)
        expiry_date_str = expiry_date.strftime("%Y-%m-%dT%H:%M:%SZ")

        result = None
        # TODO currently connector_id is always assumed to be 0, allow flexible connector_ids
        match await context.get_ocpp_version():
            case "1.6":
                id_tag = id
                result = await OCPP16ReserveNowProcessor().process(context, connector_id=0, expiry_date=expiry_date_str, id_tag=id_tag, reservation_id=reservation_id)
            case "2.0.1":
                id_token = {"id_token": id}
                result = await OCPP20ReserveNowProcessor().process(context, id=reservation_id, expiry_date_time=expiry_date_str, id_token=id_token, reservation_id=reservation_id, evse_id=evse_id)

        return result

    async def dispatch_authorize_remote_reservation_stop(self, evse_id):

        cp_identity = None

        for item in self.data["evse_id_cs_mapping"]:
            for key, value in item.items():
                if value == evse_id:
                    cp_identity = key

        if not cp_identity:
            return

        # matching and mapping of identification
        context = await self.get_context(cp_identity)
        reservations = context.cp_data["connectors"][0]["reservations"]
        reservations_length = len(reservations)
        reservation_id = reservations[reservations_length-1]["id"]

        # TODO Manual dispatch for specific reservation_ids
        #reservation_id = 1

        result = None

        match await context.get_ocpp_version():
            case "1.6":
                result = await OCPP16CancelReservationProcessor().process(context=context, reservation_id=reservation_id)
            case "2.0.1":
                result = await OCPP20CancelReservationProcessor().process(context=context, reservation_id=reservation_id)

        return result

    async def dispatch_charging_notification_start(self, cp_identity, start_timestamp, id, meter_value):

        evse_id = None

        # Map CP_Identity to EVSE_ID
        for item in self.data["evse_id_cs_mapping"]:
            for key in item.keys():
                if key == cp_identity:
                    evse_id = item[cp_identity]

        if not evse_id:
            return

        # Map Identification to IdAuthId
        await eRoamingChargingNotifications_V11(body=
            ERoamingChargingNotificationStart(
                Type="Start",
                CPOPartnerSessionID="1234XYZ",
                EMPPartnerSessionID="2345ABC",
                ChargingStart=start_timestamp,
                EvseID=evse_id,
                Identification={
                    "RFIDMifareFamilyIdentification": {
                        "UID": id
                    }
                },
                MeterValueStart=meter_value,
                PartnerProductID="AC 1",
                SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
                SessionStart=start_timestamp,
                OperatorID=self.config["operatorId"]
            )
        )

    async def dispatch_charging_notification_updated(self, cp_identity, timestamp = None, id = None, meter_value = None):

        evse_id = None

        # Map CP_Identity to EVSE_ID
        for item in self.data["evse_id_cs_mapping"]:
            for key in item.keys():
                if key == cp_identity:
                    evse_id = item[cp_identity]

        if not evse_id:
            return

        context = await self.get_context(cp_identity)
        transactions = context.cp_data["connectors"][0]["transactions"]
        transactions_length = len(transactions)
        transaction_start_timestamp = transactions[transactions_length-1]["timestamp_start"]

        # Map Identification to IdAuthId
        await eRoamingChargingNotifications_V11(body=
            ERoamingChargingNotificationProgress(
                Type="Progress",
                CPOPartnerSessionID="1234XYZ",
                EMPPartnerSessionID="2345ABC",
                ChargingStart=transaction_start_timestamp,
                EvseID=evse_id,
                Identification={
                    "RFIDMifareFamilyIdentification": {
                        "UID": id
                    }
                },
                meter_value_in_between=meter_value,
                PartnerProductID="AC 1",
                SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
                OperatorID=self.config["operatorId"]
            )
        )

    async def dispatch_charging_notification_end(self, cp_identity, stop_timestamp, id, meter_value):

        evse_id = None

        # Map CP_Identity to EVSE_ID
        for item in self.data["evse_id_cs_mapping"]:
            for key in item.keys():
                if key == cp_identity:
                    evse_id = item[cp_identity]

        if not evse_id:
            return

        # Map Identification to IdAuthId
        await eRoamingChargingNotifications_V11(body=
            ERoamingChargingNotificationEnd(
                Type="End",
                CPOPartnerSessionID="1234XYZ",
                EMPPartnerSessionID="2345ABC",
                ChargingEnd=stop_timestamp,
                EvseID=evse_id,
                Identification={
                    "RFIDMifareFamilyIdentification": {
                        "UID": id
                    }
                },
                MeterValueEnd=meter_value,
                PartnerProductID="AC 1",
                SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
                SessionEnd=stop_timestamp,
                OperatorID=self.config["operatorId"]
            )
        )



_shared_context_manager: Optional[ContextManager] = None

def set_shared_context_manager(context_manager: ContextManager) -> None:
    global _shared_context_manager
    _shared_context_manager = context_manager

def get_shared_context_manager() -> ContextManager:
    if _shared_context_manager is None:
        raise ValueError("Global ContextManager has not been set yet!")
    return _shared_context_manager