import inspect
import json
from typing import Any, List

from aiohttp import web
import logging
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException, APIRouter, Body
from ocpp.charge_point import camel_to_snake_case
from pydantic import BaseModel, create_model
from starlette.staticfiles import StaticFiles

from compote.csms.adapters.rest.api_error_dataclasses import ContextIdErr, ContextResult
from compote.csms.processors.authorization.get_local_list import OCPP16GetLocalListVersionProcessor, \
    OCPP20GetLocalListVersionProcessor
from compote.csms.processors.authorization.send_local_list import OCPP16SendLocalListProcessor, \
    OCPP20SendLocalListProcessor
from compote.csms.processors.configuration.change_configuration import OCPP16ChangeConfigurationProcessor, \
    OCPP20SetVariablesProcessor, OCPP16ChangeConfigurationAuthenticationProcessor
from compote.csms.processors.configuration.get_configuration import OCPP16GetConfigurationProcessor, \
    OCPP20GetVariablesProcessor, OCPP16GetConfigurationAuthenticationProcessor
from compote.csms.processors.connectivity.change_availability import OCPP16ChangeAvailabilityProcessor, \
    OCPP20ChangeAvailabilityProcessor
from compote.csms.processors.connectivity.clear_cache import OCPP16ClearCacheProcessor, OCPP20ClearCacheProcessor
from compote.csms.processors.connectivity.extended_trigger_message import OCPP16ExtendedTriggerMessageProcessor
from compote.csms.processors.connectivity.heartbeat import OCPP16HeartbeatProcessor
from compote.csms.processors.connectivity.reset import OCPP16ResetProcessor, OCPP20ResetProcessor
from compote.csms.processors.connectivity.trigger_message import OCPP16TriggerMessageProcessor
from compote.csms.processors.connectivity.unlock_connector import OCPP16UnlockConnectorProcessor, \
    OCPP20UnlockConnectorProcessor
from compote.csms.processors.firmware.get_diagnostics import OCPP16GetDiagnosticsProcessor
from compote.csms.processors.reservations.cancel_reservation import OCPP16CancelReservationProcessor, \
    OCPP20CancelReservationProcessor
from compote.csms.processors.reservations.reserve_now import OCPP16ReserveNowProcessor, OCPP20ReserveNowProcessor
from compote.csms.processors.smart_charging.clear_charging_profile import OCPP16ClearChargingProfileProcessor, \
    OCPP20ClearChargingProfileProcessor
from compote.csms.processors.smart_charging.get_composite_schedule import OCPP16GetCompositeScheduleProcessor
from compote.csms.processors.smart_charging.set_charging_profile import OCPP16SetChargingProfileProcessor
from compote.csms.processors.status.get_base_report import OCPP20GetBaseReportProcessor
from compote.csms.processors.status.get_report import OCPP20GetReportProcessor
from compote.csms.processors.status.receive_data_transfer import OCPP16ReceiveDataTransferProcessor, \
    OCPP16ReceiveDataTransferGet15118EVCertificateProcessor, OCPP16ReceiveDataTransferAuthorizeProcessor, \
    OCPP16ReceiveDataTransferSignCertificateProcessor, OCPP16ReceiveDataTransferGetCertificateStatusProcessor
from compote.csms.processors.status.send_data_transfer import OCPP16SendDataTransferProcessor, \
    OCPP20SendDataTransferProcessor, \
    OCPP16SendDataTransferGetInstalledCertificateIdsProcessor, \
    OCPP16SendDataTransferCertificateSignedProcessor, OCPP16SendDataTransferTriggerMessageProcessor, \
    OCPP16SendDataTransferCertificateInstallationProcessor, OCPP16SendDataTransferDeleteCertificateProcessor
from compote.csms.processors.transactions.remote_start_transaction import OCPP16RemoteStartTransactionProcessor, \
    OCPP20RemoteStartTransactionProcessor
from compote.csms.processors.transactions.remote_stop_transaction import OCPP16RemoteStopTransactionProcessor, \
    OCPP20RemoteStopTransactionProcessor
from compote.shared.dataclasses import AuthIdTag
from compote.shared.helper_functions import convert_dict_recursive

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('webservice_adapter')

router = APIRouter()

def generate_pydantic_model_from_processor(
    processor_class,
    model_name: str
) -> BaseModel:
    """
    Inspects processor_class.process(...) signature and builds
    a dynamic Pydantic model with the same fields & types.
    """

    sig = inspect.signature(processor_class.process)
    fields = {}

    for param_name, param in sig.parameters.items():
        # skip 'self' and 'context'
        if param_name in ["self", "context"] or param.kind == inspect.Parameter.VAR_KEYWORD:
            continue

        if param.annotation != inspect._empty:
            annotated_type = param.annotation
        else:
            annotated_type = Any

        if param.default != inspect._empty:
            default_value = param.default
            fields[param_name] = (annotated_type, default_value)
        else:
            fields[param_name] = (annotated_type, ...)

    model = create_model(model_name, **fields)
    return model

async def match_context_id(context_manager, id: str) -> ContextResult:
    contexts = await context_manager.get_contexts()
    if not contexts:
        return ContextResult(valid=False, error=ContextIdErr.nocontext, context=None)
    ...
    return ContextResult(valid=True, error=ContextIdErr.valid, context=contexts[id])

async def extract_from_json(request: Request, processor_class):
    """
    extract_from_json from FastAPI Request.
    """
    try:
        json_body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return None

    json_body = camel_to_snake_case(json_body)

    # Inspect the processor's signature
    sig = inspect.signature(processor_class.process)
    values_from_request = {}

    for param_name, param in sig.parameters.items():
        # skip 'self' and 'context'
        if param_name in ["self", "context"]:
            continue
        value = json_body.get(param_name)
        if value is None and param.default != inspect.Parameter.empty:
            value = param.default
        values_from_request[param_name] = value

    return values_from_request


def add_processor_route(
    router: APIRouter,
    method: str,
    path: str,
    processor_class,
    context_manager,
    tags: List[str] = None
):
    ModelClass = generate_pydantic_model_from_processor(
        processor_class,
        model_name=processor_class.__name__ + "Body"
    )

    async def route_handler(
        id: int,
        body: ModelClass,
        request: Request
    ):

        context_result = await match_context_id(context_manager, str(id))
        if not context_result.valid:
            raise HTTPException(status_code=400, detail=context_result.error)

        processor_instance = processor_class()
        kwargs = body.dict()
        result = await processor_instance.process(context_result.context, **kwargs)
        return {"result": str(result)}

    router.add_api_route(
        path,
        route_handler,
        methods=[method],
        tags=tags
    )

def create_api_app(context_manager) -> FastAPI:
    """
    Returns a FastAPI sub-application that handles OCPP WebSockets.
    """
    api_app = FastAPI(
        title="CSMS API Service",
        version="0.0.1",
        tags=["api"]
    )

    # OCPP v16 routes
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/cancelreservation",
        processor_class=OCPP16CancelReservationProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/changeavailability",
        processor_class=OCPP16ChangeAvailabilityProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/changeconfiguration",
        processor_class=OCPP16ChangeConfigurationProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/changeconfigurationauthentication",
        processor_class=OCPP16ChangeConfigurationAuthenticationProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-TLSAuthentication"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/clearcache",
        processor_class=OCPP16ClearCacheProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/clearchargingprofile",
        processor_class=OCPP16ClearChargingProfileProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/datatransfer",
        processor_class=OCPP16SendDataTransferProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/extendedtriggermessage",
        processor_class=OCPP16ExtendedTriggerMessageProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/getconfiguration",
        processor_class=OCPP16GetConfigurationProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/getconfigurationauthentication",
        processor_class=OCPP16GetConfigurationAuthenticationProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-TLSAuthentication"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/getcompositeschedule",
        processor_class=OCPP16GetCompositeScheduleProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/getdiagnostics",
        processor_class=OCPP16GetDiagnosticsProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/getlocallistversion",
        processor_class=OCPP16GetLocalListVersionProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/heartbeat",
        processor_class=OCPP16HeartbeatProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/reset",
        processor_class=OCPP16ResetProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/reservenow",
        processor_class=OCPP16ReserveNowProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/remotestarttransaction",
        processor_class=OCPP16RemoteStartTransactionProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/remotestoptransaction",
        processor_class=OCPP16RemoteStopTransactionProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/sendlocallist",
        processor_class=OCPP16SendLocalListProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/setchargingprofile",
        processor_class=OCPP16SetChargingProfileProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/triggermessage",
        processor_class=OCPP16TriggerMessageProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/unlockconnector",
        processor_class=OCPP16UnlockConnectorProcessor,
        context_manager=context_manager,
        tags=["OCPPv16"]
    )

    # OCPP v16 - ISO15118 routes
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/datatransfergetinstalledcertificateids",
        processor_class=OCPP16SendDataTransferGetInstalledCertificateIdsProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/datatransferdeletecertificate",
        processor_class=OCPP16SendDataTransferDeleteCertificateProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/datatransfercertificatesigned",
        processor_class=OCPP16SendDataTransferCertificateSignedProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/datatransfertriggermessage",
        processor_class=OCPP16SendDataTransferTriggerMessageProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/datatransfercertificateinstallation",
        processor_class=OCPP16SendDataTransferCertificateInstallationProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/receivedatatransfer",
        processor_class=OCPP16ReceiveDataTransferProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118-Debugging"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/receivedatatransferauthorize",
        processor_class=OCPP16ReceiveDataTransferAuthorizeProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118-Debugging"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/receivedatatransfersigncertificate",
        processor_class=OCPP16ReceiveDataTransferSignCertificateProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118-Debugging"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/receivedatatransferget15118evcertificate",
        processor_class=OCPP16ReceiveDataTransferGet15118EVCertificateProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118-Debugging"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v16/receivedatatransfergetcertificatestatus",
        processor_class=OCPP16ReceiveDataTransferGetCertificateStatusProcessor,
        context_manager=context_manager,
        tags=["OCPPv16-ISO15118-Debugging"]
    )
    # OCPP v201 routes
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/reservenow",
        processor_class=OCPP20ReserveNowProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/reset",
        processor_class=OCPP20ResetProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/cancelreservation",
        processor_class=OCPP20CancelReservationProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/changeavailability",
        processor_class=OCPP20ChangeAvailabilityProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/clearcache",
        processor_class=OCPP20ClearCacheProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/clearchargingprofile",
        processor_class=OCPP20ClearChargingProfileProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/datatransfer",
        processor_class=OCPP20SendDataTransferProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/getbasereport",
        processor_class=OCPP20GetBaseReportProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/getlocallistversion",
        processor_class=OCPP20GetLocalListVersionProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/getvariables",
        processor_class=OCPP20GetVariablesProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/getreport",
        processor_class=OCPP20GetReportProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/requeststarttransaction",
        processor_class=OCPP20RemoteStartTransactionProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/requeststoptransaction",
        processor_class=OCPP20RemoteStopTransactionProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/sendlocallist",
        processor_class=OCPP20SendLocalListProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/setvariables",
        processor_class=OCPP20SetVariablesProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )
    add_processor_route(
        router,
        method="POST",
        path="/context/{id}/v20/unlockconnector",
        processor_class=OCPP20UnlockConnectorProcessor,
        context_manager=context_manager,
        tags=["OCPPv201"]
    )

    async def match_context_id(id: str) -> ContextResult:
        """Match a given id to a specific csms context
        Args:
            id (str): the id to match to a specific csms context
        """

        contexts = await context_manager.get_contexts()

        # Check context manager health
        if not contexts:
            error = ContextIdErr.nocontext
            LOGGER.error(error)
            return ContextResult(valid=False, error=error, context=None)

        # Check if number
        try:
            index = int(id)
        except ValueError:
            error = ContextIdErr.notnumber
            LOGGER.error(error)
            return ContextResult(valid=False, error=error, context=None)

        # Check if index in context
        if not index in range(len(contexts)):
            error = ContextIdErr.notindex
            LOGGER.error(error)
            return ContextResult(valid=False, error=error, context=None)

        # Try to get context
        try:
            context = contexts[index]
        except ValueError:
            error = ContextIdErr.nocontext
            return ContextResult(valid=False, error=error, context=None)

        return ContextResult(valid=True, error=ContextIdErr.valid, context=context)

    @api_app.on_event("startup")
    async def startup_event():
        config = await context_manager.get_wshandler_config()
        LOGGER.info({
            "message_type": "CSMS.WebsocketAdapter.Info",
            "function": "Start",
            "arguments": config
        })

    @api_app.get("/context", tags=["Context"])
    async def list_contexts():
        """List all csms contexts and return as json response
        Args:
            id (str): the id to match to a specific csms context
        Returns:
            web.Response: the csms contexts as a json dictionary
        """

        result = await context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = dict(await result[i].get_cp_data())
            items[i]["liveness"] = (await result[i].get_live_status())
            del items[i]["stats"]

        return items

    @api_app.get("/context/{context_id}", tags=["Context"])
    async def context(context_id: str):
        """Handle a specific route for a given request based on matched id and extracted values
        Args:
            request: the request to handle, containing an context id
        Returns:
            dict: the content of the current csms context for a given id
        """

        context_result: ContextResult = await match_context_id(id=context_id)

        if not context_result.valid:
            raise HTTPException(status_code=404, detail="Context not found")

        result = dict(await context_result.context.get_cp_data())

        result["liveness"] = await context_result.context.get_live_status()
        del result["stats"]
        return result

    @api_app.get("/context/{context_id}/errors", tags=["Context"])
    async def context_errors(context_id: str):
        """Handle a specific route for a given request based on matched id and extracted values
        Args:
            request: the request to handle, containing an context id
        Returns:
            dict: the content of the current csms context for a given id
        """

        context_result: ContextResult = await match_context_id(id=context_id)

        if not context_result.valid:
            raise HTTPException(status_code=404, detail="Context not found")

        data = dict(await context_result.context.get_cp_data())
        messages = dict()
        messages["messages_errors"] = data["stats"]["processing"]["errors"]["messages"]
        messages["ocpp_errors"] = data["stats"]["ocpp"]["errors"]["messages"]

        return messages

    @api_app.get("/context/{context_id}/messages", tags=["Context"])
    async def context_messages(context_id: str):
        """Handle a specific route for a given request based on matched id and extracted values
        Args:
            request: the request to handle, containing an context id
        Returns:
            dict: the content of the current csms context for a given id
        """

        context_result: ContextResult = await match_context_id(id=context_id)

        if not context_result.valid:
            raise HTTPException(status_code=404, detail="Context not found")

        data = dict(await context_result.context.get_cp_data())
        result = dict()
        result["messages_in"] = data["stats"]["processing"]["in"]["messages"]
        result["messages_out"] = data["stats"]["processing"]["out"]["messages"]
        result["last_messages"] = [convert_dict_recursive(m) for m in
                                   list(data["stats"]["ocpp"]["all"]["last_messages"])]
        result["messages_delta"] = data["stats"]["processing"]["delta"]["messages"]

        return result

    @api_app.post("/context/{context_id}/data", tags=["Context"])
    async def context_field(
            context_id: str,
            fields: List[str] = Body(...)
    ):
        """
        Handle a specific route for a given request based on matched id and extracted values

        Args:
            context_id: the context ID from the path
            fields: list of fields to extract from the context data

        Returns:
            A dict containing either all of the context data (if fields is empty)
            or a subset of the data filtered by `fields`.
        """
        context_result: ContextResult = await match_context_id(id=context_id)

        if not context_result.valid:
            raise HTTPException(status_code=404, detail=context_result.error)

        result = dict(await context_result.context.get_cp_data())

        if fields:
            newresult = {}
            for field in fields:
                try:
                    newresult[field] = result[field]
                except KeyError as error:
                    LOGGER.error(f"Field '{field}' not found: {error}")
            return newresult

        return result

    @api_app.get("/context_manager_data", tags=["Context"])
    async def list_context_manager_data():
        """List all csms context manager data and return as json
        Returns:
            web.Response: the csms context manager data wrapped in json
        """
        result = await context_manager.get_data()
        return result

    @api_app.get("/log_uuid", tags=["Logging"])
    async def log_uuid():
        """Get log entries grouped by uuid as json
        Args:
            request: the request to handle
        Returns:
            web.Response: event entries as json
        """
        log = await context_manager.get_log_by_uuid()
        if not log:
            raise HTTPException(status_code=404, detail="Log not found")

        return log

    @api_app.get("/log", tags=["Logging"])
    async def log():
        """Get log entries grouped by uuid as json
        Args:
            request: the request to handle
        Returns:
            web.Response: logging entries as json
        """
        log = await context_manager.get_json_log()

        if not log:
            raise HTTPException(status_code=404, detail="Log not found")

        return log
    
    @api_app.get("/auth_id_tags", tags=["Context"])
    async def auth_tags():
        """Get auth id tags as json
        Args:
            request: the request to handle
        Returns:
            web.Response: event entries as json
        """
        auth_id_tags = await context_manager.get_auth_id_tags()
        # if not log:
        #     raise HTTPException(status_code=404, detail="Log not found")

        return auth_id_tags

    @api_app.post("/auth_id_tags/add", tags=["Context"])
    async def auth_tags_add(auth_id_tag: AuthIdTag):
        """Add auth id tag
        Args:
            auth_id_tag: the AuthIdTag to add
        Returns:
            web.Response: auth_id_tags entries as json
        """
        await context_manager.add_auth_id(auth_id_tag)

        auth_id_tags = await context_manager.get_auth_id_tags()

        return auth_id_tags

    @api_app.post("/auth_id_tags/remove", tags=["Context"])
    async def auth_tags_remove(id: str):
        """Remove auth id tag
        Args:
            request: the request to handle
        Returns:
            web.Response: event entries as json
        """
        removed_auth_id = await context_manager.remove_auth_id(id)

        return removed_auth_id

    api_app.mount("/static", StaticFiles(directory=Path(__file__).parents[0] / "static"), name="static")

    api_app.include_router(router)
    return api_app