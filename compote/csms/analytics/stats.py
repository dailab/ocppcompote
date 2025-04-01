import logging
import time
from datetime import datetime
import functools

from ocpp.v16.call import HeartbeatPayload

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('analytics_engine')


def log_processing(name):
    """Log the processing of a messages and capture errors using decorator function
    Args:
        name (str): the name of the function to be logged
    Returns:
        decorator: the decorator to be used
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(self, *args, **kwargs):
            context = None
            if args and hasattr(args[0], 'cp_data'):
                context = args[0]
            elif 'context' in kwargs and hasattr(kwargs['context'], 'cp_data'):
                context = kwargs['context']
            else:
                context = self

            fun_name = name
            in_time = await update_processing_in(context, fun_name=fun_name)

            try:
                result = await func(self, *args, **kwargs)
            except Exception as e:
                error_time = str(datetime.utcnow())
                LOGGER.error(f"Exception caught in {fun_name}: {str(e)}")
                await log_processing_error(context, fun_name=fun_name, locals=locals(), error_time=error_time, error=str(e))
                raise
            finally:
                await update_processing_out(context, fun_name=fun_name, in_time=in_time)

            return result

        return wrapper
    return decorator

def log_ocpp_processing(type):
    """Log the processing of ocpp messages using a decorator function
    Args:
        type (str): the type of the message (req or resp) denoting communication side of the exchange
    Returns:
        decorator: the decorator to be used
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            self = args[0]

            fun_name = func.__name__
            in_time = await update_ocpp_in(self, fun_name=fun_name, locals=locals(), type=type)

            output = None
            try:
                output = await func(*args, **kwargs)

                #LOGGER.info("OCPP call, dispatching " + fun_name + str(kwargs))
                message_type = "OCPP.Call.Dispatch"
                function = fun_name
                arguments = kwargs

                #arguments["uuid"] = self.last_uuid

                msg = {"message_type" : message_type, "function" : function, "arguments" : arguments}

                LOGGER.info(msg)
            except Exception as e:
                error_time = str(datetime.utcnow())
                LOGGER.error(f"Exception caught in {fun_name}: {str(e)}")
                await log_ocpp_error(self, fun_name=fun_name, locals=locals(), error_time=error_time,error=str(e))
                raise
            finally:
                await update_ocpp_out(self, fun_name=fun_name, output=output, in_time=in_time, type="resp")

            return output

        return wrapper

    return decorator

async def update_ocpp_in(context, fun_name=None, locals=None, type=None):
    """Log the processing of incoming ocpp messages
    Args:
        context (Context): the charging station context
        fun_name (str): the name of the function to be logged
        locals (dict): the local variables of the function environment
        type (str): the type of the message (req or resp) denoting communication side
    Returns:
        dict: the dictionary for the arrival time and processing time regarding the processed message
    """
    context_object = context.context
    current_time = datetime.utcnow()
    processing_time = time.perf_counter()
    data = context_object.cp_data["stats"]["ocpp"]
    data["in"]["last_message"] = fun_name
    data["in"]["time_last_message"] = str(current_time)
    data["in"]["total"] += 1

    if fun_name in data["in"]["messages"]:
        data["in"]["messages"][fun_name] += 1
    else:
        data["in"]["messages"][fun_name] = 1

    values = {k: v for k, v in locals.items() if v is not None and k != "self"}
    data["in"]["last_messages"].append(
        {"fun_name": fun_name, "args": values, "time_start": current_time.replace(microsecond=0)})

    if fun_name.startswith("on"):
        data["all"]["last_messages"].append(
            {"fun_name": fun_name, "type": type, "args": values, "time_start": current_time.replace(microsecond=0)})
    else:
        data["all"]["last_messages"].append(
            {"fun_name": fun_name, "type": type, "args": values, "time_start": current_time.replace(microsecond=0)})

    return {"time": current_time, "processing_time": processing_time}

async def update_ocpp_out(context, fun_name=None, output=None, in_time=None, type=None):
    """Log the processing of outgoing ocpp messages
    Args:
        context (Context): the charging station context
        fun_name (str): the name of the function to be logged
        output (dict): the output regarding the processed message
        in_time (float): the time when the incoming ocpp message was first registered
        type (str): the type of the message (req or resp) denoting communication side
    Returns:
        dict: the dictionary for the arrival time and processing time regarding the processed message
    """
    context_object = context.context
    current_time = datetime.utcnow()
    processing_time = time.perf_counter()
    data = context_object.cp_data["stats"]["ocpp"]
    data["out"]["last_message"] = fun_name
    data["out"]["time_last_message"] = str(current_time)
    data["out"]["total"] += 1

    if fun_name in data["out"]["messages"]:
        data["out"]["messages"][fun_name] += 1
    else:
        data["out"]["messages"][fun_name] = 1

    delta = processing_time - in_time["processing_time"]
    if fun_name in data["delta"]["messages"]:
        data["delta"]["messages"][fun_name].append(delta)
    else:
        data["delta"]["messages"][fun_name] = [delta]

    if isinstance(output, dict):
        values = {k: v for k, v in output.items() if v is not None and k != "self"}
    elif isinstance(output, HeartbeatPayload):
        values = {"current_time": output.current_time}
    else:
        values = str(output)

    data["out"]["last_messages"].append(
        {"fun_name": fun_name, "args": values, "time_start": current_time.replace(microsecond=0)})
    data["delta"]["last_messages"].append({"fun_name": fun_name, "args": values, "fun_name": fun_name,
                                           "time_start": in_time["time"].replace(microsecond=0),
                                           "time_stop": current_time.replace(microsecond=0), "duration": delta})

    if fun_name.startswith("send"):
        data["all"]["last_messages"].append(
            {"fun_name": fun_name, "type": type, "args": values, "time_start": current_time.replace(microsecond=0)})
    else:
        data["all"]["last_messages"].append(
            {"fun_name": fun_name, "type": type, "args": values, "time_start": current_time.replace(microsecond=0)})

    return {"time": current_time, "processing_time": processing_time}


async def update_processing_in(context, fun_name=None):
    """Log the processing of incoming messages at the message processor functions
    Args:
        context (Context): the charging station context
        fun_name (str): the name of the function to be logged
    Returns:
        dict: the dictionary for the arrival time and processing time regarding the processed message
    """

    current_time = datetime.utcnow()
    processing_time = time.perf_counter()

    data = context.cp_data["stats"]["processing"]["in"]
    data["last_message"] = fun_name
    data["time_last_message"] = str(current_time)
    data["total"] += 1

    if fun_name in data["messages"]:
        data["messages"][fun_name] += 1
    else:
        data["messages"][fun_name] = 1

    return {"time": current_time, "processing_time": processing_time}


async def update_processing_out(context, fun_name=None, in_time=None):
    """Log the processing of outgoing messages at the message processor functions
    Args:
        context (Context): the charging station context
        fun_name (str): the name of the function to be logged
        in_time (float): the time when the incoming message to be processed was first registered
    Returns:
        dict: the dictionary for the arrival time and processing time regarding the processed message
    """
    current_time = datetime.utcnow()
    processing_time = time.perf_counter()

    data = context.cp_data["stats"]["processing"]
    data["out"]["last_message"] = fun_name
    data["out"]["time_last_message"] = str(current_time)
    data["out"]["total"] += 1

    if fun_name in data["out"]["messages"]:
        data["out"]["messages"][fun_name] += 1
    else:
        data["out"]["messages"][fun_name] = 1

    delta = processing_time - in_time["processing_time"]
    if fun_name in data["delta"]["messages"]:
        data["delta"]["messages"][fun_name].append(delta)
    else:
        data["delta"]["messages"][fun_name] = [delta]

    data["delta"]["last_messages"].append({"fun_name": fun_name, "time_start": in_time["time"].replace(microsecond=0),
                                           "time_stop": current_time.replace(microsecond=0), "duration": delta})


async def log_processing_error(context, fun_name=None, locals = None, error_time = None, error=None):
    """Log the processing errors with respect to processed messages
    Args:
        context (Context): the charging station context
        fun_name (str): the name of the function to be logged
        locals (dict): the local variables of the function environment
        error_time (str): the time when the error was captured
        in_time (float): the time when the incoming message to be processed was first registered
    Returns:
        dict: the dictionary for the error times, error messages and their arguments
    """
    #if context is not None:
    #    context_object = context.context
    #else:

    context_object = context

    data = context_object.cp_data["stats"]["processing"]["errors"]
    data["total"] += 1
    values = {k: v for k, v in locals.items() if v is not None and k != "self"}

    if fun_name in data["messages"]:
        data["messages"][fun_name].append(
            {"error_time": error_time, "error": str(error), "args": values})
    else:
        data["messages"][fun_name] = []
        data["messages"][fun_name].append(
            {"error_time": error_time, "error": str(error), "args": values})


async def log_ocpp_error(context, fun_name=None, locals=None, error_time = None, error=None):
    """Log the ocpp errors with respect to processed messages
    Args:
        context (Context): the charging station context
        fun_name (str): the name of the function to be logged
        locals (dict): the local variables of the function environment
        error_time (str): the time when the error was captured
        error (str): the error message captured
    Returns:
        dict: the dictionary for the error times, error messages and their arguments
    """
    context_object = context.context
    data = context_object.cp_data["stats"]["ocpp"]["errors"]
    data["total"] += 1
    values = {k: v for k, v in locals.items() if v is not None and k != "self"}

    if fun_name in data["messages"]:
        data["messages"][fun_name].append(
            {"error_time": error_time, "error": str(error), "args": str(values)})
    else:
        data["messages"][fun_name] = []
        data["messages"][fun_name].append(
            {"error_time": error_time, "error": str(error), "args": str(values)})