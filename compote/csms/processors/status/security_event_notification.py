from typing import Dict, Any

from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context


class GenericSecurityEventNotificationProcessor:
    async def process(self, context: Context, type: str, timestamp: str, tech_info: str = None, custom_date: Dict[str, Any] = None, **kwargs):
        return True

class OCPP20SecurityEventNotificationProcessor(GenericSecurityEventNotificationProcessor):
    @log_processing(name="process_security_event_notification")
    async def process(self, context: Context, type: str, timestamp: str, tech_info: str = None, custom_date: Dict[str, Any] = None, **kwargs):
        await super().process(context=context, type=type, timestamp=timestamp, tech_info=tech_info, custom_date=custom_date, **kwargs)
        #TODO logging of security event in context
        return True