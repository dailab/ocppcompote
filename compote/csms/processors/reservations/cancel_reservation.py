
from typing import Dict

from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context

class GenericCancelReservationProcessor:
    async def process(self, context: Context, reservation_id: int, **kwargs):
        return True

class OCPP16CancelReservationProcessor(GenericCancelReservationProcessor):
    @log_processing(name="process_cancel_reservation")
    async def process(self, context: Context, reservation_id: int, **kwargs):
        print(context)
        await super().process(context, reservation_id, **kwargs)
        result = await context.cp.send_cancel_reservation(reservation_id)
        return result

class OCPP20CancelReservationProcessor(GenericCancelReservationProcessor):
    @log_processing(name="process_cancel_reservation")
    async def process(self, context: Context, reservation_id: int, custom_data: Dict = None, **kwargs):
        await super().process(context, reservation_id, **kwargs)
        result = await context.cp.send_cancel_reservation(reservation_id, custom_data)
        return result