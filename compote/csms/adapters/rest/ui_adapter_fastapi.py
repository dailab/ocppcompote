import json
import logging
from datetime import datetime

from fastapi import FastAPI, Request, APIRouter
import numpy
from starlette.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path

from compote.csms.adapters.rest.api_error_dataclasses import ContextIdErr, ContextResult
from compote.csms.adapters.rest.webservice_adapter_fastapi import match_context_id

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('webservice_adapter')

router = APIRouter()

def create_ui_app(context_manager) -> FastAPI:

    ui_app = FastAPI(
        title="CSMS UI Service",
        version="0.0.1",
        tags=["ui"]
    )

    templates = Jinja2Templates(directory= Path(__file__).parents[0] / "templates")
    
    @ui_app.get("/", response_class=HTMLResponse)
    async def index(request: Request):
        
        result = await context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = await result[i].get_cp_data()
            items[i]["liveness"] = (await result[i].get_live_status())

        data = await context_manager.get_data()

        context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items, 'data': data}
        
        return templates.TemplateResponse(
            request=request, name="dashboard.html", context=context
    )

    @ui_app.get("/authidtags", response_class=HTMLResponse)
    async def authidtags(request: Request):
        
        auth_id_tags = await context_manager.get_auth_id_tags()
        result = await context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = await result[i].get_cp_data()

        context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items,
                   'auth_id_tags': auth_id_tags}
        
        return templates.TemplateResponse(
            request=request, name="authidtags.html", context=context
    )   

    @ui_app.get("/status", response_class=HTMLResponse)
    async def status(request: Request):
        
        log = await context_manager.get_logfile()
        auth_id_tags = await context_manager.get_auth_id_tags()
        result = await context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = await result[i].get_cp_data()

        context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items,
                    'auth_id_tags': auth_id_tags, 'log': log}
        
        return templates.TemplateResponse(
            request=request, name="status.html", context=context
    )   

    @ui_app.get("/settings", response_class=HTMLResponse)
    async def settings(request: Request):
        
        config = await context_manager.get_config()
        result = await context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = await result[i].get_cp_data()
            items[i]["liveness"] = (await result[i].get_live_status())

        context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items, 'config': config}
        
        return templates.TemplateResponse(
            request=request, name="settings.html", context=context
    )   

    @ui_app.get("/chargingstations", response_class=HTMLResponse)
    async def chargingstations(request: Request):
        
        result = await context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = await result[i].get_cp_data()
            items[i]["liveness"] = (await result[i].get_live_status())

        context = {'current_time': datetime.now().replace(microsecond=0), 'contexts': items}
        
        return templates.TemplateResponse(
            request=request, name="chargingstations.html", context=context
    )   
        
    @ui_app.get("/chargingstations/{id}", response_class=HTMLResponse)
    async def chargingstations_view(request: Request, id: int):
        context_result: ContextResult = await match_context_id(context_manager=context_manager, id=id)

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

            messages = json.dumps(messages)

            context = {'current_time': datetime.now().replace(microsecond=0), 'key': id,
                        'context': data, 'messages': messages}
        
            return templates.TemplateResponse(
                request=request, name="chargingstation_view.html", context=context
    ) 
        
    @ui_app.get("/chargingstations/{id}/analytics", response_class=HTMLResponse)
    async def analytics(request: Request, id: int):
        context_result: ContextResult = await match_context_id(context_manager=context_manager, id=id)

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

            messages = json.dumps(messages)

            context = {'current_time': datetime.now().replace(microsecond=0), 'key': id,
                        'context': data, 'messages': messages}
        
            return templates.TemplateResponse(
                request=request, name="chargingstation_analytics.html", context=context
    )                 

    @ui_app.get("/chargingstations/{id}/error_viewer", response_class=HTMLResponse)
    async def error_viewer(request: Request, id: int):
        context_result: ContextResult = await match_context_id(context_manager=context_manager, id=id)

        if context_result.valid:
            data = await context_result.context.get_cp_data()
            data["liveness"] = await context_result.context.get_live_status()

            messages = dict()
            messages["messages_errors"] = data["stats"]["processing"]["errors"]["messages"]
            messages["ocpp_errors"] = data["stats"]["ocpp"]["errors"]["messages"]

            messages = json.dumps(messages)

            context = {'current_time': datetime.now().replace(microsecond=0), 'key': id,
                        'context': data, 'messages': messages}
        
            return templates.TemplateResponse(
                request=request, name="chargingstation_error_viewer.html", context=context
    )

    @ui_app.get("/chargingstations/{id}/message_editor_v16", response_class=HTMLResponse)
    async def error_viewer(request: Request, id: int):
        context_result: ContextResult = await match_context_id(context_manager=context_manager, id=id)

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

            context = {'current_time': datetime.now().replace(microsecond=0), 'key': id,
                       'context': data, 'messages': messages}

            import os

            def get_filenames(dir_path):
                return [
                    os.path.splitext(file)[0]
                    for file in os.listdir(dir_path)
                    if file.endswith(".json")
                ]

            context["filenames"] = get_filenames(Path(__file__).parents[0] / "static/json/16")

            return templates.TemplateResponse(
                request=request, name="message_editor_v16.html", context=context
            )

    ui_app.mount("/static", StaticFiles(directory=Path(__file__).parents[0] / "static"), name="static")

    ui_app.include_router(router)

    return ui_app