from datetime import datetime
from typing import Optional


class ERoamingContext:

    data = {
        "config": {
            "cpo_config": {
                "CPO_URL": "http://127.0.0.1:8001/oicp_api"
            },
            "emp_config": {
                "EMP_URL": "http://127.0.0.1:8000/oicp"
            }
        },
        "operatorId": "DE*ABC",
        "providerId": "DE*DCB",
        "charging_notifications": [],
        "authorizations" : [],
        "remote_authorizations" : [],
        "remote_reservations" : [],
        "cdrs": [],
        "cs_data" : [],
        "cs_status_data": [],
        "pricing_product_data" : [],
        "evse_pricing" : [],
        "authentication_data_records" : []
    }

    currentresponse = {}
    currentrequest = {}
    currentlog = {}

    def __init__(self, config=None):
        self.data["startup"] = str(datetime.utcnow())
        if config is not None:
            self.data["config"] = config

_shared_context: Optional[ERoamingContext] = None

def set_shared_context(context: ERoamingContext) -> None:
    global _shared_context
    _shared_context = context

def get_shared_context() -> ERoamingContext:
    if _shared_context is None:
        raise ValueError("Global ERoamingContext has not been set yet!")
    return _shared_context