from __future__ import annotations

from asyncio import Task
from abc import ABC
import logging
from typing import Dict

LOGGER = logging.getLogger('context')
logging.basicConfig(level=logging.INFO)

class Context(ABC):

    cs_config = None
    wshandler_config = None
    wshandler_task = None
    cp = None
    connectors = None
    transactions = None

    local_authorization_cache = None

    def __init__(self, cp = None, config: Dict = None) -> None:

        self.wshandler_config = config["wshandler_config"]
        self.cs_config = config["cs_config"]
        self.cp = cp
        self.connectors = dict()

    async def set_wshandler_task(self, wshandler_task: Task):
        self.wshandler_task = wshandler_task

    async def get_wshandler_config(self):
        return self.wshandler_config

    async def set_wshandler_config(self, wshandler_config):
        self.wshandler_config = wshandler_config

    async def set_cs_config(self, cs_config):
        self.cs_config = cs_config

    async def get_cs_config(self):
        return self.cs_config

    async def register_cp(self, cp):
        self.cp = cp
        LOGGER.info("Registered ChargePoint: " + str(cp.id))

