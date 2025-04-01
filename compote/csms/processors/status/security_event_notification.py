from typing import Dict, Any
from datetime import datetime
from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context


class GenericSecurityEventNotificationProcessor:
    async def process(self, context: Context, type: str, timestamp: str, tech_info: str = None, custom_date: Dict[str, Any] = None, **kwargs):

        info = {
            "timestamp" : timestamp,
            "type" : type,
            "tech_info" : tech_info,
            "custom_date" : custom_date
        }

        context.cp_data["security_event_notifications"].append({str(datetime.utcnow()): info})

        return True

class OCPP16SecurityEventNotificationProcessor(GenericSecurityEventNotificationProcessor):
    @log_processing(name="process_security_event_notification")
    async def process(self, context: Context, type: str, timestamp: str, tech_info: str = None, **kwargs):
        await super().process(context=context, type=type, timestamp=timestamp, tech_info=tech_info, custom_date = {}, **kwargs)
        return True

class OCPP20SecurityEventNotificationProcessor(GenericSecurityEventNotificationProcessor):
    @log_processing(name="process_security_event_notification")
    async def process(self, context: Context, type: str, timestamp: str, tech_info: str = None, custom_date: Dict[str, Any] = None, **kwargs):
        await super().process(context=context, type=type, timestamp=timestamp, tech_info=tech_info, custom_date=custom_date, **kwargs)
        return True