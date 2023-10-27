from typing import Dict, Any

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericReserveNowProcessor:
    async def process(self, context: Context, connector_id: int, expiry_date: str, id_tag: Any, reservation_id: int, parent_id_tag: Any = None, connector_type: str = None, **kwargs):
        return True

class OCPP16ReserveNowProcessor(GenericReserveNowProcessor):
    @log_processing(name="process_reserve_now")
    async def process(self, context: Context, connector_id: int, expiry_date: str, id_tag: str, reservation_id: int, parent_id_tag: str = None, **kwargs):
        await super().process(context, connector_id, expiry_date, id_tag, reservation_id, parent_id_tag)
        result = await context.cp.send_reserve_now(connector_id, expiry_date, id_tag, reservation_id, parent_id_tag)
        return result

class OCPP20ReserveNowProcessor(GenericReserveNowProcessor):
    @log_processing(name="process_reserve_now")
    async def process(self, context: Context, id: int, expiry_date_time: str, id_token: Dict, connector_type: str = None, evse_id: int = None, group_id_token: Dict = None, **kwargs):
        await super().process(context, connector_id = evse_id, expiry_date=expiry_date_time, id_tag=id_token, reservation_id=id, parent_id_tag=group_id_token, connector_type=connector_type, **kwargs)
        result = await context.cp.send_reserve_now(id, expiry_date_time, id_token, connector_type, evse_id, group_id_token)
        return result