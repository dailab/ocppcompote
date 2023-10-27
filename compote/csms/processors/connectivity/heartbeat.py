from datetime import datetime

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericHeartbeatProcessor:
    @log_processing(name="process_heartbeat")
    async def process(self, context: Context):
        time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S') + "Z"
        return {"current_time" : time}

class OCPP16HeartbeatProcessor(GenericHeartbeatProcessor):
    pass

class OCPP20HeartbeatProcessor(GenericHeartbeatProcessor):
    pass