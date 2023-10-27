
from typing import Any, List

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

class GenericGetConfigurationProcessor:
    async def process(self, context: Context, key: List = None, **kwargs):
        return True

class OCPP16GetConfigurationProcessor(GenericGetConfigurationProcessor):
    @log_processing(name="process_get_configuration")
    async def process(self, context: Context, key: List = None, **kwargs):
        await super().process(context, key, **kwargs)
        result = await context.cp.send_get_configuration(key)
        return result

class OCPP20GetVariablesProcessor(GenericGetConfigurationProcessor):
    @log_processing(name="process_get_configuration")
    async def process(self, context: Context, get_variable_data: List, **kwargs):
        await super().process(context, key=get_variable_data, **kwargs)
        result = await context.cp.send_get_variables(get_variable_data)
        return result