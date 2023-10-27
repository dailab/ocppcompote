
from typing import Any, List

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

class GenericChangeConfigurationProcessor:
    async def process(self, context: Context, key: str = None, value: Any = None, set_variable_data: List = None, **kwargs):
        return True

class OCPP16ChangeConfigurationProcessor(GenericChangeConfigurationProcessor):
    @log_processing(name="process_change_configuration")
    async def process(self, context: Context, key: str, value: Any, **kwargs):
        await super().process(context, key, value, **kwargs)
        result = await context.cp.send_change_configuration(key, value)
        return result

class OCPP20SetVariablesProcessor(GenericChangeConfigurationProcessor):
    @log_processing(name="process_set_variables")
    async def process(self, context: Context, set_variable_data: List, **kwargs):
        await super().process(context, set_variable_data=set_variable_data, **kwargs)
        result = await context.cp.send_set_variables(set_variable_data)
        return result