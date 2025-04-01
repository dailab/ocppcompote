
from abc import abstractmethod
from typing import Dict, List
from compote.cs.cs_context import Context

class CsBehavior(Context):

    state = "authorize"

    messages = ["boot_notification", "authorize", "heartbeat", "start_transaction", "stop_transaction", "status", "meter_values",]

    async def get_current(self) -> str:
        return self.state

    async def get_messages(self) -> List:
        return self.messages

    async def set_messages(self, messages: List):
        self.messages = messages

    @abstractmethod
    async def get_next(self) -> str:
        pass

    @abstractmethod
    async def process_reset(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_trigger_message(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_extended_trigger_message(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_remote_start(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_remote_stop(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_set_charging_profile(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_cancel_reservation(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_reserve_now(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_change_availability(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_change_configuration(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_clear_cache(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_clear_charging_profile(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_get_composite_schedule(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_get_configuration(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_get_diagnostics(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_data_transfer(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_get_local_list_version(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_send_local_list(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_update_firmware(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def process_unlock_connector(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    def perform_boot_notification(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_authorize(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_heartbeat(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_start_transaction(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_stop_transaction(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_status_notification(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_meter_values(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_data_transfer(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_diagnostic_status_notification(self, **kwargs) -> Dict:
        pass

    @abstractmethod
    async def perform_firmware_status_notification(self, **kwargs) -> Dict:
        pass