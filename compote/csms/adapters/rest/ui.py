import json
from datetime import datetime

import aiohttp_jinja2
import numpy
import ocpp
from aiohttp import web

from compote.csms.adapters.rest.api_error_dataclasses import ContextResult

async def index(self, request) -> web.Response:
    result = await self.context_manager.get_contexts()
    items = dict()
    for i in range(len(result)):
        items[i] = await result[i].get_cp_data()
        items[i]["liveness"] = (await result[i].get_live_status())

    data = await self.context_manager.get_data()

    context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items, 'data': data}
    response = aiohttp_jinja2.render_template("dashboard.html", request, context=context)
    return response


async def authidtags(self, request) -> web.Response:
    auth_id_tags = await self.context_manager.get_auth_id_tags()
    result = await self.context_manager.get_contexts()
    items = dict()
    for i in range(len(result)):
        items[i] = await result[i].get_cp_data()

    context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items,
                   'auth_id_tags': auth_id_tags}
    response = aiohttp_jinja2.render_template("authidtags.html", request, context=context)
    return response

async def status(self, request) -> web.Response:
    log = await self.context_manager.get_logfile()
    auth_id_tags = await self.context_manager.get_auth_id_tags()
    result = await self.context_manager.get_contexts()
    items = dict()
    for i in range(len(result)):
        items[i] = await result[i].get_cp_data()

    context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items,
                   'auth_id_tags': auth_id_tags, 'log': log}
    response = aiohttp_jinja2.render_template("status.html", request, context=context)
    return response

async def api(self, request) -> web.Response:
    result = await self.context_manager.get_contexts()
    items = dict()
    for i in range(len(result)):
        items[i] = await result[i].get_cp_data()

    result = list({(key.resource.canonical): None for key in self.routes}.keys())

    ocpp_v16_messages = ocpp.v16.enums.MessageTrigger._value2member_map_.keys()
    ocpp_v201_messages = ocpp.v201.enums.MessageTriggerType._value2member_map_.keys()

    context = {"routes": result, 'current_time': datetime.now().replace(microsecond=0), 'contexts': items,
                   'ocpp_v16_messages': ocpp_v16_messages, 'ocpp_v201_messages': ocpp_v201_messages}
    response = aiohttp_jinja2.render_template("api.html", request, context=context)
    return response

async def settings(self, request) -> web.Response:
    config = await self.context_manager.get_config()
    result = await self.context_manager.get_contexts()
    items = dict()
    for i in range(len(result)):
        items[i] = await result[i].get_cp_data()
        items[i]["liveness"] = (await result[i].get_live_status())

    context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items, 'config': config}
    response = aiohttp_jinja2.render_template("settings.html", request, context=context)
    return response

async def chargingstations(self, request) -> web.Response:
    result = await self.context_manager.get_contexts()
    items = dict()
    for i in range(len(result)):
        items[i] = await result[i].get_cp_data()
        items[i]["liveness"] = (await result[i].get_live_status())

    context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items}
    response = aiohttp_jinja2.render_template("chargingstations.html", request, context=context)
    return response

async def chargingstation_view(self, request) -> web.Response:
    context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

    if context_result.valid:
        data = await context_result.context.get_cp_data()
        data["liveness"] = await context_result.context.get_live_status()

        messages = dict()
        messages["messages_in"] = data["stats"]["processing"]["in"]["messages"]
        messages["messages_out"] = data["stats"]["processing"]["out"]["messages"]
        messages_delta = dict(data["stats"]["processing"]["delta"]["messages"])
        for item in messages_delta:
            messages_delta[item] = numpy.average(messages_delta[item])
        messages["messages_delta"] = messages_delta
        messages["messages_delta_raw"] = data["stats"]["processing"]["delta"]["messages"]
        messages["messages_errors"] = data["stats"]["processing"]["errors"]["messages"]
        messages["ocpp_in"] = data["stats"]["ocpp"]["in"]["messages"]
        messages["ocpp_out"] = data["stats"]["ocpp"]["out"]["messages"]
        ocpp_delta = dict(data["stats"]["ocpp"]["delta"]["messages"])
        for item in ocpp_delta:
            ocpp_delta[item] = numpy.average(ocpp_delta[item])
        messages["ocpp_delta"] = ocpp_delta
        messages["ocpp_delta_raw"] = data["stats"]["ocpp"]["delta"]["messages"]
        messages["ocpp_errors"] = data["stats"]["ocpp"]["errors"]["messages"]

        # Convert to json
        messages = json.dumps(messages)

        context = {'current_time': datetime.now().replace(microsecond=0), 'key': request.match_info['id'],
                       'context': data, 'messages': messages}
        response = aiohttp_jinja2.render_template("chargingstation_view.html", request, context=context)
        return response
    else:
        return web.json_response(text=context_result.error)

async def analytics(self, request) -> web.Response:
    context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

    if context_result.valid:
        data = await context_result.context.get_cp_data()
        data["liveness"] = await context_result.context.get_live_status()

        messages = dict()
        messages["messages_in"] = data["stats"]["processing"]["in"]["messages"]
        messages["messages_out"] = data["stats"]["processing"]["out"]["messages"]
        messages_delta = dict(data["stats"]["processing"]["delta"]["messages"])
        for item in messages_delta:
            messages_delta[item] = numpy.average(messages_delta[item])
        messages["messages_delta"] = messages_delta
        messages["messages_delta_raw"] = data["stats"]["processing"]["delta"]["messages"]
        messages["messages_errors"] = data["stats"]["processing"]["errors"]["messages"]
        messages["ocpp_in"] = data["stats"]["ocpp"]["in"]["messages"]
        messages["ocpp_out"] = data["stats"]["ocpp"]["out"]["messages"]
        ocpp_delta = dict(data["stats"]["ocpp"]["delta"]["messages"])
        for item in ocpp_delta:
            ocpp_delta[item] = numpy.average(ocpp_delta[item])
        messages["ocpp_delta"] = ocpp_delta
        messages["ocpp_delta_raw"] = data["stats"]["ocpp"]["delta"]["messages"]
        messages["ocpp_errors"] = data["stats"]["ocpp"]["errors"]["messages"]

        # Convert to json
        messages = json.dumps(messages)

        context = {'current_time': datetime.now().replace(microsecond=0), 'key': request.match_info['id'],
                       'context': data, 'messages': messages}
        response = aiohttp_jinja2.render_template("chargingstation_analytics.html", request, context=context)
        return response
    else:
        return web.json_response(text=context_result.error)


async def error_viewer(self, request) -> web.Response:
    context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

    if context_result.valid:
        data = await context_result.context.get_cp_data()
        data["liveness"] = await context_result.context.get_live_status()

        messages = dict()
        messages["messages_errors"] = data["stats"]["processing"]["errors"]["messages"]
        messages["ocpp_errors"] = data["stats"]["ocpp"]["errors"]["messages"]

        messages = json.dumps(messages)

        context = {'current_time': datetime.now().replace(microsecond=0), 'key': request.match_info['id'],
                       'context': data, 'messages': messages}
        response = aiohttp_jinja2.render_template("chargingstation_error_viewer.html", request, context=context)
        return response
    else:
        return web.json_response(text=context_result.error)

async def message_editor_v20(self, request) -> web.Response:
    context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

    if context_result.valid:
        data = await context_result.context.get_cp_data()
        data["liveness"] = await context_result.context.get_live_status()

        messages = dict()
        messages["messages_in"] = data["stats"]["processing"]["in"]["messages"]
        messages["messages_out"] = data["stats"]["processing"]["out"]["messages"]
        messages_delta = dict(data["stats"]["processing"]["delta"]["messages"])
        for item in messages_delta:
            messages_delta[item] = numpy.average(messages_delta[item])
        messages["messages_delta"] = messages_delta
        messages["messages_delta_raw"] = data["stats"]["processing"]["delta"]["messages"]
        messages["ocpp_in"] = data["stats"]["ocpp"]["in"]["messages"]
        messages["ocpp_out"] = data["stats"]["ocpp"]["out"]["messages"]
        ocpp_delta = dict(data["stats"]["ocpp"]["delta"]["messages"])
        for item in ocpp_delta:
            ocpp_delta[item] = numpy.average(ocpp_delta[item])
        messages["ocpp_delta"] = ocpp_delta
        messages["ocpp_delta_raw"] = data["stats"]["ocpp"]["delta"]["messages"]

        messages = json.dumps(messages)

        context = {'current_time': datetime.now().replace(microsecond=0), 'key': request.match_info['id'],
                       'context': data, 'messages': messages}
        response = aiohttp_jinja2.render_template("message_editor_v20.html", request, context=context)
        return response

async def message_editor_v16(self, request) -> web.Response:
    context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

    if context_result.valid:
        data = await context_result.context.get_cp_data()
        data["liveness"] = await context_result.context.get_live_status()

        messages = dict()
        messages["messages_in"] = data["stats"]["processing"]["in"]["messages"]
        messages["messages_out"] = data["stats"]["processing"]["out"]["messages"]
        messages_delta = dict(data["stats"]["processing"]["delta"]["messages"])
        for item in messages_delta:
            messages_delta[item] = numpy.average(messages_delta[item])
        messages["messages_delta"] = messages_delta
        messages["messages_delta_raw"] = data["stats"]["processing"]["delta"]["messages"]
        messages["ocpp_in"] = data["stats"]["ocpp"]["in"]["messages"]
        messages["ocpp_out"] = data["stats"]["ocpp"]["out"]["messages"]
        ocpp_delta = dict(data["stats"]["ocpp"]["delta"]["messages"])
        for item in ocpp_delta:
            ocpp_delta[item] = numpy.average(ocpp_delta[item])
        messages["ocpp_delta"] = ocpp_delta
        messages["ocpp_delta_raw"] = data["stats"]["ocpp"]["delta"]["messages"]

        messages = json.dumps(messages)

        context = {'current_time': datetime.now().replace(microsecond=0), 'key': request.match_info['id'],
                       'context': data, 'messages': messages}

        import os

        def get_filenames(dir_path):
            return [
                os.path.splitext(file)[0]
                for file in os.listdir(dir_path)
                if file.endswith(".json")
            ]

        context["filenames"] = get_filenames(
             "../csms/adapters/rest/static/json/16")

        response = aiohttp_jinja2.render_template("message_editor_v16.html", request, context=context)
        return response