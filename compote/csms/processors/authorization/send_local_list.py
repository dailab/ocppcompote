
from typing import Any, List, Optional, Dict

from ocpp.v16.enums import UpdateType
from ocpp.v201.enums import UpdateType as UpdateTypeOCPP20

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

class GenericSendLocalListProcessor:
    async def process(self, context: Context, list_version: int, update_type: Any, local_authorization_list: List = None, **kwargs):
        return True

class OCPP16SendLocalListProcessor(GenericSendLocalListProcessor):
    @log_processing(name="process_send_local_list")
    async def process(self, context: Context, list_version: int, update_type: UpdateType, local_authorization_list: List = None, **kwargs):
        await super().process(context, list_version, update_type, local_authorization_list, **kwargs)
        result = await context.cp.send_send_local_list(list_version, update_type, local_authorization_list)
        return result

class OCPP20SendLocalListProcessor(GenericSendLocalListProcessor):
    @log_processing(name="process_send_local_list")
    async def process(self, context: Context, list_version: int, update_type: UpdateTypeOCPP20, local_authorization_list: List = None, custom_data: Optional[Dict] = None, **kwargs):
        await super().process(context, list_version, update_type, local_authorization_list, **kwargs)
        result = await context.cp.send_send_local_list(list_version, update_type, local_authorization_list, custom_data)
        return result