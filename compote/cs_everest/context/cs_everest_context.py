import asyncio
import logging
from datetime import datetime
from typing import Optional

from asyncio_mqtt import Client, MqttError


class CSEverestContext:
    data = {
        "config": {
        },
        "messages" : [],
        "state" : {"1" : "Idle", "2" : "Idle"},
    }

    currentlog = {}
    client = None

    topics = [('everest_external/nodered/1/carsim/cmd/execute_charging_session', 0),
              ('everest_api/dummy_token_provider/cmd/provide', 0),
              ('everest_external/nodered/1/carsim/cmd/modify_charging_session', 0),
              ('everest_external/nodered/1/state/state_string', 0),
              ('everest_external/nodered/2/state/state_string', 0)
              ]


    def __init__(self, config=None):
        self.data["startup"] = str(datetime.utcnow())
        if config is not None:
            self.data["config"] = config

        asyncio.create_task(self.connect_client())

    async def connect_client(self):
        while True:
            try:
                async with Client(
                    self.data["config"]["mqtt_config"]["hostname"],
                    self.data["config"]["mqtt_config"]["port"],
                    keepalive=self.data["config"]["mqtt_config"]["keepalive"]
                ) as client:
                    self.client = client
                    loop = asyncio.get_event_loop()
                    task = loop.create_task(self.listen(client))
                    await task
            except MqttError as e:
                logging.error(f"MQTT connection error: {e}. Retrying in 10 seconds...")
                await asyncio.sleep(10)

    async def listen(self, client):
        async with client.messages() as messages:
            await client.subscribe(self.topics)
            async for message in messages:
                logging.info(message.payload)
                self.data["messages"].append({"timestamp" : datetime.utcnow(), "topic" : message.topic.value, "payload" : str(message.payload)})
                byte_payload = message.payload
                string_payload = byte_payload.decode('utf-8')
                if message.topic.value == "everest_external/nodered/1/state/state_string":
                    self.data["state"].update({"1" : string_payload})
                elif message.topic.value == "everest_external/nodered/2/state/state_string":
                    self.data["state"].update({"2" : string_payload})




_shared_context: Optional[CSEverestContext] = None

def set_shared_context(context: CSEverestContext) -> None:
    global _shared_context
    _shared_context = context

def get_shared_context() -> CSEverestContext:
    if _shared_context is None:
        raise ValueError("Global CSEverestContext has not been set yet!")
    return _shared_context
