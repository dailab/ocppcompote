import logging
from datetime import datetime
from typing import List

from compote.csms.context.csms_context import Context
from compote.shared.dataclasses import AuthIdTag
from compote.shared.helper_functions import log_tail

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_contextmanager')

class ContextManager:

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
        self.contexts.append(context)
        LOGGER.info("charging station added " + str(context.cp.id))

    async def detach_context(self, context):
         self.contexts.remove(context)

    async def register_new_cp_context(self, cp):

        for item in self.contexts:
            if item.cp_data["id"] == cp.id:
                return item

        context = Context()
        await context.register_new_cp(cp, await self.get_cp_defaults(), await self.get_auth_id_tags())
        await self.add_context(context)

        return context

    async def get_contexts(self) -> List[Context]:
        return self.contexts

    async def get_context(self, id: int) -> Context:
        return self.get_contexts()[id]

    async def delete_context(self, id: int) -> Context:
        del self.get_contexts()[id]

    async def get_contexts_dict(self) -> dict:
        items: dict = None
        contexts = await self.get_contexts()
        for i in range(len(contexts)):
            items[i] = await contexts[i].get_cp_data()
        return items

    async def set_wshandler_config(self, wshandler_config):
        self.wshandler_config = wshandler_config

    async def get_wshandler_config(self):
        return self.wshandler_config

    async def set_webservice_config(self, webservice_config):
        self.webservice_config = webservice_config

    async def get_webservice_config(self):
        return self.webservice_config

    async def set_cp_defaults(self, cp_defaults):
        self.cp_defaults = cp_defaults

    async def get_cp_defaults(self):
        return self.cp_defaults

    async def get_auth_id_tags(self):
       return self.auth_id_tags

    async def get_data(self):
       return self.data

    async def get_logfile_name(self):
        return self.logfile_name

    async def get_logfile(self):
        return await log_tail(await self.get_logfile_name())

    async def get_config(self):
        return self.config

    async def set_config(self, config):
        self.config = config

    async def add_auth_id(self, auth_id_tag: AuthIdTag):
        self.auth_id_tags.update({auth_id_tag.id : auth_id_tag.asdict()})