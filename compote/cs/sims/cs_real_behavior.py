from typing import Dict
from compote.cs.sims.cs_behavior import CsBehavior

class CsRealBehavior(CsBehavior):

    def __init__(self, cp=None, config: Dict = None):
        super().__init__(cp=cp, config=config)

    async def process_reset(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_trigger_message(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_extended_trigger_message(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_remote_start(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_remote_stop(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_set_charging_profile(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_cancel_reservation(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_reserve_now(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_change_availability(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_change_configuration(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_clear_cache(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_clear_charging_profile(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_get_composite_schedule(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_get_configuration(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_get_diagnostics(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_data_transfer(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_get_local_list_version(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_send_local_list(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_update_firmware(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def process_unlock_connector(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_boot_notification(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_authorize(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_heartbeat(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_start_transaction(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_stop_transaction(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_status_notification(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_meter_values(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_data_transfer(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_diagnostic_status_notification(self, **kwargs) -> Dict:
        raise NotImplementedError

    async def perform_firmware_status_notification(self, **kwargs) -> Dict:
        raise NotImplementedError