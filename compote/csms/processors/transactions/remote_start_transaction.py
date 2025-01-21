from typing import Dict

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericRemoteStartTransactionProcessor:
    async def process(self, context: Context, id_tag: str, connector_id: int = None, charging_profile: Dict = None, **kwargs):
        return True

class OCPP16RemoteStartTransactionProcessor(GenericRemoteStartTransactionProcessor):
    @log_processing(name="process_remote_start_transaction")
    async def process(self, context: Context, id_tag: str, connector_id: int = None, charging_profile: Dict = None, **kwargs):
        await super().process(context, id_tag, connector_id, charging_profile)
        result = await context.cp.send_remote_start_transaction(id_tag, connector_id, charging_profile)
        return result

class OCPP20RemoteStartTransactionProcessor(GenericRemoteStartTransactionProcessor):
    @log_processing(name="process_remote_start_transaction")
    async def process(self, context: Context, id_token: Dict, remote_start_id: int, evse_id: int = None, group_id_token: Dict = None, charging_profile: Dict = None, custom_data: Dict = None, **kwargs):
        await super().process(context, id_token.get("id_token"), connector_id=evse_id, charging_profile=charging_profile)
        result = await context.cp.send_request_start_transaction(id_token, remote_start_id, evse_id, group_id_token, charging_profile, custom_data)
        return result