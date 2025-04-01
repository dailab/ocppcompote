from typing import Dict, Any, List
from datetime import datetime
from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context


class GenericNotifyEventProcessor:
    async def process(self, context: Context, generated_at: str, seq_no: int, event_data: List, tbc: bool = None, custom_data = None, **kwargs):
        return True

class OCPP20NotifyEventProcessor(GenericNotifyEventProcessor):
    @log_processing(name="process_notify_event")
    async def process(self, context: Context, generated_at: str, seq_no: int, event_data: List, tbc: bool = None, custom_data = None, **kwargs):
        await super().process(context=context, generated_at=generated_at, seq_no=seq_no, event_data=event_data, tbc=tbc, custom_data=custom_data, **kwargs)
        return True
