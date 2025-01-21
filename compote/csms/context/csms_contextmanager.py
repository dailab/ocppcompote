import logging
from datetime import datetime
from typing import List, Dict

from compote.csms.context.csms_context import Context
from compote.shared.dataclasses import AuthIdTag
from compote.shared.helper_functions import log_tail, log_json

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_contextmanager')


class ContextManager:
    """
    Class used to represent charging station management system state.
    """

    wshandler_config = None
    webservice_config = None
    contexts = None
    config = None
    cp_defaults = None
    auth_id_tags: dict = None
    data: dict = None

    def __init__(self, config = None, logfile_name = None):
        self.config = config
        self.wshandler_config = config["wshandler_config"]
        self.cp_defaults = config["cp_defaults"]
        self.webservice_config = config["webservice_config"]
        self.auth_id_tags = config["auth_id_tags"]
        self.logfile_name = logfile_name
        self.contexts = list()
        self.data = dict()
        self.data["startup"] = str(datetime.utcnow())

    async def add_context(self, context):
        """Add a new charging station context to the context manager
        Args:
            context (Context): csms context
        """
        self.contexts.append(context)

        message_type = "CSMS.ContextManager.Info"
        function = "AddChargingStation"
        arguments = {"cp_identity" : context.cp.id}
        msg = {"message_type": message_type, "function": function, "arguments": arguments}
        LOGGER.info(msg)

        #LOGGER.info("charging station added " + str(context.cp.id))

    async def detach_context(self, context):
        """Remove a charging station context from the context manager
        Args:
            context (Context): csms context
        """
        self.contexts.remove(context)

    async def register_new_cp_context(self, cp):
        """Register a new OCPP ChargePoint instance in the context manager
        Args:
            cp (ChargePoint): instance of the communication adapter
        """

        for item in self.contexts:
            if item.cp_data["id"] == cp.id:
                return item

        context = Context()
        await context.register_new_cp(cp, await self.get_cp_defaults(), await self.get_auth_id_tags())
        await self.add_context(context)

        return context

    async def get_contexts(self) -> List[Context]:
        """List all OCPP charging station contexts
        Returns:
            List[Context]: list of charging station contexts
        """
        return self.contexts

    async def get_context(self, id: int) -> Context:
        """Get charging station context based on its id
        Args:
            id (int): id of the context to get
        Returns:
            List[Context]: list of charging station contexts
        """
        return self.get_contexts()[id]

    async def delete_context(self, id: int) -> Context:
        """Delete a specific charging station context based on its id
        Args:
            id (int): id of the context to delete
        Returns:
            List[Context]: list of charging station contexts
        """
        del self.get_contexts()[id]

    async def get_contexts_dict(self) -> dict:
        """Get a dictionary off all charging station contexts
        Returns:
            dict: list of charging station contexts
        """
        items: dict = None
        contexts = await self.get_contexts()
        for i in range(len(contexts)):
            items[i] = await contexts[i].get_cp_data()
        return items

    async def set_wshandler_config(self, wshandler_config):
        """Set the configuration for the ocpp WebSocket handler
        Args:
            wshandler_config (dict): configuration for WebSocket adapter
        """
        self.wshandler_config = wshandler_config

    async def get_wshandler_config(self):
        """Get the configuration for the ocpp WebSocket handler
        Returns:
            dict: dictionary of the ocpp WebSocket handler configuration
        """
        return self.wshandler_config

    async def set_webservice_config(self, webservice_config):
        """Set the configuration for the webservice handler
        Args:
            webservice_config (dict): configuration for webservice adapter
        """
        self.webservice_config = webservice_config

    async def get_webservice_config(self):
        """Get the configuration for the webservice adapter
        Returns:
            dict: dictionary of the webservice adapter configuration
        """
        return self.webservice_config

    async def set_cp_defaults(self, cp_defaults):
        """Set the default values for new contexts
        Args:
            cp_defaults (dict): configuration for webservice adapter
        """
        self.cp_defaults = cp_defaults

    async def get_cp_defaults(self):
        """Get the default values for new contexts
        Returns:
            dict: dictionary of the default values
        """
        return self.cp_defaults

    async def get_auth_id_tags(self):
        """Get all authorization id tags registered in the csms
        Returns:
            dict: dictionary of the authorization id tags
        """
        return self.auth_id_tags

    async def get_data(self):
        """Get system operation data
        Returns:
            dict: dictionary of the system operation data
        """
        return self.data

    async def get_logfile_name(self):
        """Get the name of the current CSMS logfile
        Returns:
            str: name of the current CSMS logfile
        """
        return self.logfile_name

    async def get_logfile(self):
        """Get the current CSMS logfile
        Returns:
            List: list of the last entries of the current CSMS logfile
        """
        return await log_tail(await self.get_logfile_name())

    async def get_json_log(self):
        """Get a json array of entries of the current CSMS logfile
        Returns:
            List: list of the json objects of the current CSMS logfile
        """
        return await log_json(await self.get_logfile_name())

    # TODO - Workaround
    async def get_log_by_uuid(self):
        results = {}
        entries = await log_json(await self.get_logfile_name())

        for entry in entries:
            arguments = entry.get("arguments", {})

            # Detect if actual uuid in send and receive ocpp messages
            if isinstance(arguments, List) and len(arguments) > 1:
                if arguments[0] <= 2:
                    results[arguments[1]] = []
                results[arguments[1]].append(entry)
            # Detect uuid in analytics processing message
            elif isinstance(arguments, Dict) and "uuid" in arguments:
                results[arguments["uuid"]].append(entry)

        return results

    async def get_config(self):
        """Get comprehensive configuration values
        Returns:
            dict: dictionary of the configuration values
        """
        return self.config

    async def set_config(self, config):
        """Set comprehensive configuration values for the csms
        Args:
            config (dict): dictionary of the configuration values
        """
        self.config = config

    async def add_auth_id(self, auth_id_tag: AuthIdTag):
        """Add a new AuthIdTag to the context manager of the csms
        Args:
            auth_id_tag (AuthIdTag): the authidtag to add
        """
        self.auth_id_tags.update({auth_id_tag.id : auth_id_tag.asdict()})