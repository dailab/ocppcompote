from datetime import datetime
from typing import Optional

class EMPContext:
    data = {
        "config": {
            "oicp_server_config": {
                "OICP_SERVER_URL": "http://127.0.0.1:8000/oicp"
            }
        },
        "root": {},
        "cpos": {},
        "charging_notifications": [],
        "authorizations" : [],
        "remote_authorizations" : [],
        "remote_reservations" : [],
        "cdrs": [],
        "cs_data" : [],
        "cs_status_data": [],
        "pricing_product_data" : [],
        "evse_pricing" : [],
        "providerId": "DE*DCB",
        "authentication_data_records" : []
    }

    currentresponse = {}
    currentrequest = {}
    currentlog = {}

    def __init__(self, config=None):
        self.data["startup"] = str(datetime.utcnow())
        if config is not None:
            self.data["config"] = config
            self.data["providerId"] = config["providerId"]
            self.data["users"] = config["users"]
            self.data["authentication_data_records"] = config["authentication_data_records"]

_shared_context: Optional[EMPContext] = None

def set_shared_context(context: EMPContext) -> None:
    global _shared_context
    _shared_context = context

def get_shared_context() -> EMPContext:
    if _shared_context is None:
        raise ValueError("Global EMPContext has not been set yet!")
    return _shared_context