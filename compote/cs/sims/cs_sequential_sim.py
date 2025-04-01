
from datetime import datetime
from typing import Dict
from ocpp.v16.enums import DiagnosticsStatus, FirmwareStatus, ChargePointErrorCode, ChargePointStatus

from compote.cs.sims.cs_behavior import CsBehavior

class CsSequentialSim(CsBehavior):

    state = "authorize"
    transaction_id = 0
    meter = 0
    connector_id = 0

    messages = ["authorize", "heartbeat", "start_transaction", "stop_transaction", "status", "meter_values"]

    def __init__(self, cp=None, config: Dict = None):
        super().__init__(cp=cp, config=config)

    async def get_next(self) -> str:

        current = self.messages.index(self.state)

        if current+1 < len(self.messages):
            self.state = self.messages[current+1]
            return self.messages[current]
        else:
            self.state = self.messages[0]
            return self.messages[current]

    # TODO
    async def process_reset(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_trigger_message(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_extended_trigger_message(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_remote_start(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_remote_stop(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_set_charging_profile(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_cancel_reservation(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_reserve_now(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_change_availability(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_change_configuration(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_clear_cache(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_clear_charging_profile(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_get_composite_schedule(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_get_configuration(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_get_diagnostics(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_data_transfer(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_get_local_list_version(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_send_local_list(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_update_firmware(self, **kwargs) -> Dict:
        pass

    # TODO
    async def process_unlock_connector(self, **kwargs) -> Dict:
        pass

    async def perform_boot_notification(self, **kwargs) -> Dict:
        return {"charge_point_model" : "Optimus", "charge_point_vendor" : "The Mobility House"}

    async def perform_authorize(self, **kwargs) -> Dict:
        return {"id_tag" : "ABC12345"}

    async def perform_heartbeat(self, **kwargs) -> Dict:
        pass

    async def perform_start_transaction(self, **kwargs) -> Dict:
        return {"connector_id" : self.connector_id, "id_tag" : 'ABC12345', "meter_start" : self.meter, "timestamp" : datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S') + "Z"}

    async def perform_stop_transaction(self, **kwargs) -> Dict:
        self.meter = self.meter + 50
        return {"meter_stop" : self.meter, "id_tag" : 'ABC12345', "timestamp" : datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S') + "Z", "transaction_id" : self.transaction_id}

    async def perform_status_notification(self, **kwargs) -> Dict:
        return {"connector_id" : self.connector_id, "error_code" : ChargePointErrorCode.no_error, "status" : ChargePointStatus.available}

    async def perform_meter_values(self, **kwargs) -> Dict:
        meter_value = [
                {
                    "timestamp": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S') + "Z",
                    "sampledValue": [
                        {
                            "value": "ABCDEFGHIJKLM",
                            "context": "Transaction.Begin",
                            "format": "Raw",
                            "measurand": "Energy.Active.Import.Register",
                            "phase": "N",
                            "location": "Body",
                            "unit": "V"
                        }]
                }
            ]

        return {"connector_id": self.connector_id, "meter_value": meter_value, "transaction_id": self.transaction_id}

    async def perform_data_transfer(self, message_id: str = None, **kwargs) -> Dict:

        match message_id:
            case 'Authorize': return {
                "message_id":"Authorize",
                "data":"{\"idToken\":{\"idToken\":\"ABC12345\",\"type\":\"eMAID\"},\"iso15118CertificateHashData\":[{\"hashAlgorithm\":\"SHA256\",\"issuerNameHash\":\"\",\"issuerKeyHash\":\"\",\"serialNumber\":\"\",\"responderURL\":\"\"},{\"hashAlgorithm\":\"SHA256\",\"issuerNameHash\":\"\",\"issuerKeyHash\":\"\",\"serialNumber\":\"\",\"responderURL\":\"\"},{\"hashAlgorithm\":\"SHA256\",\"issuerNameHash\":\"\",\"issuerKeyHash\":\"\",\"serialNumber\":\"\",\"responderURL\":\"\"}]}",
                "vendor_id":"org.openchargealliance.iso15118pnc"}
            case 'Get15118EVCertificate': return {
                "message_id":"Get15118EVCertificate",
                "data":"{\"action\":\"Install\",\"exiRequest\":\"\",\"iso15118SchemaVersion\":\"urn:iso:15118:2:2013:MsgDef\"}",
                "vendor_id":"org.openchargealliance.iso15118pnc"}
            case 'SignCertificate': return {
                "message_id":"SignCertificate",
                "data":"{\"}",
                "vendor_id":"org.openchargealliance.iso15118pnc"}
            case 'GetCertificateStatus': return {
                "vendor_id":"org.openchargealliance.iso15118pnc",
                "data":"{\"ocspRequestData\": {\n\"hashAlgorithm\": \"SHA256\",\n\"issuerNameHash\": \"\",\n\"issuerKeyHash\": \"\",\n\"serialNumber\": \"\",\n\"responderURL\": \"\"\n}\n}","message_id":"GetCertificateStatus"}
            case _:
                return {"vendor_id" : 'ABCDEF'}

    async def perform_diagnostic_status_notification(self, **kwargs) -> Dict:
        return {"status" : DiagnosticsStatus.idle}

    async def perform_firmware_status_notification(self, **kwargs) -> Dict:
        return {"status" : FirmwareStatus.idle}