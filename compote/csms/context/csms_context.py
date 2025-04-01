import logging
from asyncio import Task
from collections import deque
from datetime import datetime, timedelta
from dateutil import parser as datetimeparser

from ocpp.v16.enums import RegistrationStatus
from compote.shared.enums import IdTag

logging.basicConfig(level=logging.INFO)


class Context:
    """
    A class used to represent individual charging station state on the csms
    """

    cp = None
    cp_data = None
    cp_defaults = None
    auth_id_tags = None
    connectors = None
    transactions = None
    db = None
    context_manager = None

    async def register_new_cp(self, cp, context_manager, cp_defaults=None, auth_id_tags=None):
        """Register a new OCPP ChargePoint instance in the context manager
        Args:
            cp (ChargePoint): instance of the communication adapter
        """
        self.cp = cp
        self.cp_defaults = cp_defaults
        self.auth_id_tags = auth_id_tags
        self.context_manager = context_manager
        self.LOGGER = logging.getLogger('csms_context:' + self.cp.id)
        await self.create_cp_data(self.cp)

        message_type = "CSMS.Context.Info"
        function = "CreateChargingStation"
        arguments = {"cp_identity": cp.id}
        msg = {"message_type": message_type, "function": function, "arguments": arguments}
        self.LOGGER.info(msg)


    async def create_cp_data(self, cp):
        """Create system data for a new OCPP ChargePoint instance in the context manager based on default configuration
        Args:
            cp (ChargePoint): instance of the communication adapter
        """
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
                                                               "total": 0,
                                                               "last_message": None,
                                                               "time_last_message": None,
                                                               "messages": {},
                                                               "last_messages": deque([], maxlen=10)
                                                           },
                                                       "out":
                                                           {
                                                               "total": 0,
                                                               "last_message": None,
                                                               "time_last_message": None,
                                                               "messages": {},
                                                               "last_messages": deque([], maxlen=10)
                                                           },
                                                       "delta": {
                                                           "messages": {},
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
                                                               "total": 0,
                                                               "last_message": None,
                                                               "time_last_message": None,
                                                               "messages": {}
                                                           },
                                                       "out":
                                                           {
                                                               "total": 0,
                                                               "last_message": None,
                                                               "time_last_message": None,
                                                               "messages": {}
                                                           },
                                                       "delta": {
                                                           "messages": {},
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
                                           "security_event_notifications" : [],
                                           "data_transfers": [],
                                           "connectors": {
                                               0: {
                                                   "status": [],
                                                   "transactions": [],
                                                   "meter_values": [],
                                                   "reservations": []
                                               },
                                               1: {
                                                   "status": [],
                                                   "transactions": [],
                                                   "meter_values": [],
                                                   "reservations": []
                                               },
                                               2: {
                                                   "status": [],
                                                   "transactions": [],
                                                   "meter_values": [],
                                                   "reservations": []
                                               }
                                           },
                                        }

    async def get_cp_data(self):
        """Get all csms context data related to the specific charge point
        Returns:
            dict: dict of charging station contexts
        """
        return self.cp_data

    async def init_connector(self, connector_id):
        """Initialize a specific connector of the charge point within the csms
        Args:
            connector_id (int): id of the connector to initialize
        """

        self.cp_data["connectors"][connector_id] = {
            "meter_values": [],
            "status": [],
            "transactions": [],
            "reservations": []
        }

        return self.cp_data["connectors"][connector_id]

    async def get_live_status(self):
        """Get liveness status for a specific charge point
        Returns:
            float: time passed since last message of the charge point
        """
        data = await self.get_cp_data()
        live = datetimeparser.parse(data["stats"]["processing"]["in"]["time_last_message"]).replace(
            tzinfo=None) + timedelta(seconds=data["interval"]) - datetime.utcnow().replace(tzinfo=None)
        return live.total_seconds()

    async def update_cp_data(self, cp=None, values=None):
        """Update the first seen value for a charge point
        """
        self.cp_data = {"seen": str(datetime.now())}

    async def get_ocpp_version(self):
        """Return the ocpp protocol version for a specific charge point
        Returns:
            str: ocpp version of the charge point
        """
        return self.cp_data["ocpp_version"]

    async def set_wshandler_task(self, wshandler_task: Task):
        """Assign a specific ocpp WebSocket handler task to the csms context
        Args:
            wshandler_task (Task): the WebSocket handler task to assign
        """
        self.wshandler_task = wshandler_task

    async def determine_authorization_status(self, id_tag: str):
        """Determine the authorization status of a specific id_tag
        Args:
            id_tag (str): the id_tag to check
        Returns:
            IdTag: the status of the id_tag
        """
        exists = any(item['value'] == id_tag for item in self.auth_id_tags.values())

        if exists:
            return IdTag.accepted
        else:
            return IdTag.invalid
