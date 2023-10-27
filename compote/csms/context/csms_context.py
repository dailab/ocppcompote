import logging
from asyncio import Task
from collections import deque
from datetime import datetime, timedelta
from dateutil import parser as datetimeparser

from ocpp.v16.enums import RegistrationStatus
from compote.shared.enums import IdTag

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_context')


class Context:

    cp = None
    cp_data = None
    cp_defaults = None
    auth_id_tags = None
    connectors = None
    transactions = None
    db = None

    async def register_new_cp(self, cp, cp_defaults = None, auth_id_tags = None):
        self.cp = cp
        self.cp_defaults = cp_defaults
        self.auth_id_tags = auth_id_tags
        await self.create_cp_data(self.cp)

    async def create_cp_data(self, cp):
        self.cp_data = self.cp_defaults | {"id": cp.id,
                                           "registration_status": RegistrationStatus.pending,
                                           "seen": str(datetime.utcnow()),
                                           "auth": True,
                                           "auth_id": None,
                                           "resets": [],
                                           "ocpp_version": self.cp._ocpp_version,
                                           "local_list_version": None,
                                           "stats": {
                                              "ocpp":
                                                   {
                                                       "all":
                                                           {
                                                               "last_messages": deque([], maxlen=10)
                                                           },
                                                       "in":
                                                           {
                                                               "total" : 0,
                                                               "last_message" : None,
                                                               "time_last_message": None,
                                                               "messages" : {},
                                                               "last_messages": deque([], maxlen=10)
                                                           },
                                                       "out":
                                                           {
                                                                "total" : 0,
                                                                "last_message" : None,
                                                                "time_last_message": None,
                                                                "messages" : {},
                                                               "last_messages": deque([], maxlen=10)
                                                           },
                                                       "delta": {
                                                           "messages" : {},
                                                           "last_messages": deque([], maxlen=10)
                                                       },
                                                       "errors": {
                                                           "total": 0,
                                                           "messages": {}
                                                       }
                                                   },
                                               "processing":
                                                   {
                                                       "in":
                                                           {
                                                               "total" : 0,
                                                               "last_message" : None,
                                                               "time_last_message": None,
                                                               "messages" : {}
                                                           },
                                                       "out":
                                                           {
                                                                "total" : 0,
                                                                "last_message" : None,
                                                                "time_last_message": None,
                                                                "messages" : {}
                                                           },
                                                       "delta": {
                                                           "messages" : {},
                                                           "last_messages": deque([], maxlen=10)
                                                       },
                                                       "errors": {
                                                           "total": 0,
                                                           "messages": {}
                                                       }
                                                   }
                                           },
                                           "data_transfer": {
                                               "known_vendors": [],
                                               "known_message_ids": [],
                                           },
                                           "diagnostic_status_notifications": [],
                                           "firmware_status_notifications": [],
                                           "connectors": {}
                                           }

    async def get_cp_data(self):
        return self.cp_data

    async def init_connector(self, connector_id):

        self.cp_data["connectors"][connector_id] = {
                "meter_values": [],
                "status": [],
                "transactions": [],
                "reservations": []
        }

        return self.cp_data["connectors"][connector_id]


    async def get_live_status(self):
        data = await self.get_cp_data()
        live = datetimeparser.parse(data["stats"]["processing"]["in"]["time_last_message"]).replace(tzinfo=None) + timedelta(seconds=data["interval"]) - datetime.utcnow().replace(tzinfo=None)
        return live.total_seconds()

    async def update_cp_data(self, cp, values = None):
        self.cp_data = {"seen" : str(datetime.now())}

    async def get_ocpp_version(self):
        return self.cp_data["ocpp_version"]

    async def set_wshandler_task(self, wshandler_task: Task):
        self.wshandler_task = wshandler_task

    async def determine_authorization_status(self, id_tag: str):
        exists = any(item['value'] == id_tag for item in self.auth_id_tags.values())

        if exists:
            return IdTag.accepted
        else:
            return IdTag.invalid