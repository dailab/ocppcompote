import inspect
import json
from json import JSONDecodeError

import aiohttp_jinja2
import aiohttp_cors
import jinja2
from aiohttp import web
import logging
from pathlib import Path

from ocpp.charge_point import camel_to_snake_case

from compote.csms.adapters.rest.api_error_dataclasses import ContextIdErr, ContextResult
from compote.csms.adapters.rest.ui import authidtags, status, settings, api, analytics, message_editor_v20, \
    message_editor_v16, error_viewer, chargingstation_view, chargingstations, index
from compote.csms.context.csms_contextmanager import ContextManager
from compote.csms.processors.authorization.get_local_list import OCPP16GetLocalListVersionProcessor
from compote.csms.processors.authorization.send_local_list import OCPP16SendLocalListProcessor
from compote.csms.processors.configuration.change_configuration import OCPP16ChangeConfigurationProcessor, \
    OCPP20SetVariablesProcessor
from compote.csms.processors.configuration.get_configuration import OCPP16GetConfigurationProcessor, \
    OCPP20GetVariablesProcessor
from compote.csms.processors.connectivity.change_availability import OCPP16ChangeAvailabilityProcessor, \
    OCPP20ChangeAvailabilityProcessor
from compote.csms.processors.connectivity.clear_cache import OCPP16ClearCacheProcessor
from compote.csms.processors.connectivity.extended_trigger_message import OCPP16ExtendedTriggerMessageProcessor
from compote.csms.processors.connectivity.heartbeat import OCPP16HeartbeatProcessor
from compote.csms.processors.connectivity.reset import OCPP16ResetProcessor, OCPP20ResetProcessor
from compote.csms.processors.connectivity.trigger_message import OCPP16TriggerMessageProcessor
from compote.csms.processors.connectivity.unlock_connector import OCPP16UnlockConnectorProcessor
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
from compote.csms.processors.status.send_data_transfer import OCPP16SendDataTransferProcessor, \
    OCPP20SendDataTransferProcessor
from compote.csms.processors.transactions.remote_start_transaction import OCPP16RemoteStartTransactionProcessor
from compote.csms.processors.transactions.remote_stop_transaction import OCPP16RemoteStopTransactionProcessor

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('aiohttp_adapter')

class WebServiceAdapter:

    context_manager: ContextManager = None

    def __init__(self, context_manager: ContextManager = None):
        self.context_manager = context_manager

    def add_route(self, method: str, path: str, processor):
        handler = self.handle_route(path, method, processor)
        self.app.router.add_route(method, path, handler)

    async def set_context_manager(self, context_manager: ContextManager):
        self.context_manager = context_manager

    async def match_context_id(self, id: str) -> ContextResult:
        contexts = await self.context_manager.get_contexts()

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

    async def list_contexts(self, request):
        LOGGER.info("Getting Context cp_data")
        result = await self.context_manager.get_contexts()
        items = dict()
        for i in range(len(result)):
            items[i] = dict(await result[i].get_cp_data())
            del items[i]["stats"]

        return web.json_response(items)

    async def extract_from_json(self, request, processor_class):
        values_from_request = {}

        try:
            json_body = await request.json()
        except (JSONDecodeError, ValueError):
            # TODO Handle
            LOGGER.error("Error decoding JSON from request.")
            return None

        json_body = camel_to_snake_case(json_body)

        sig = inspect.signature(processor_class.process)

        for param_name, param in sig.parameters.items():
            if param_name not in ["self", "context"]:
                value = json_body.get(param_name)
                if value is None and param.default != inspect.Parameter.empty:
                    value = param.default
                values_from_request[param_name] = value

        return values_from_request

    def handle_route(self, path: str, method: str, processor):
        async def handler(request):
            context_id = request.match_info.get('id', None)
            if not context_id:
                return web.json_response(text="Missing context ID in request.")

            context_result = await self.match_context_id(id=context_id)

            if not context_result.valid:
                return web.json_response(text=context_result.error)

            data = await self.extract_from_json(request, processor)

            if data is None:
                return web.json_response(text="Invalid JSON input")

            result = await processor().process(context_result.context, **data)
            return web.json_response(str(result))

        return handler

    async def context(self, request):
        context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

        if context_result.valid:
            result = dict(await context_result.context.get_cp_data())

            request.match_info['id']

            return web.json_response("Getting context" + str(result))
        else:
            return web.json_response(text=context_result.error)

    async def errors(self, request) -> web.Response:
        context_result: ContextResult = await self.match_context_id(id=request.match_info['id'])

        if context_result.valid:
            data = dict(await context_result.context.get_cp_data())
            messages = dict()
            messages["messages_errors"] = data["stats"]["processing"]["errors"]["messages"]
            messages["ocpp_errors"] = data["stats"]["ocpp"]["errors"]["messages"]

            messages = json.dumps(messages)
            return web.json_response(messages)
        else:
            return web.json_response(text=context_result.error)

    async def run(self):
        LOGGER.info("started http adapter")
        self.app = web.Application()
        aiohttp_jinja2.setup(
            self.app, loader=jinja2.FileSystemLoader(Path(__file__).parents[0] / "templates")
        )

        # General API Routes
        self.app.router.add_get('/api/context', self.list_contexts)
        self.app.router.add_get('/api/context/{id}', self.context)
        self.app.router.add_get('/api/context/{id}/errors', self.errors)

        # OCPP v16 API Routes
        self.add_route('POST', '/api/context/{id}/v16/cancelreservation', OCPP16CancelReservationProcessor)
        self.add_route('POST', '/api/context/{id}/v16/changeavailability', OCPP16ChangeAvailabilityProcessor)
        self.add_route('POST', '/api/context/{id}/v16/changeconfiguration', OCPP16ChangeConfigurationProcessor)
        self.add_route('POST', '/api/context/{id}/v16/clearcache', OCPP16ClearCacheProcessor)
        self.add_route('POST', '/api/context/{id}/v16/clearchargingprofile', OCPP16ClearChargingProfileProcessor)
        self.add_route('POST', '/api/context/{id}/v16/datatransfer', OCPP16SendDataTransferProcessor)
        self.add_route('POST', '/api/context/{id}/v16/extendedtriggermessage', OCPP16ExtendedTriggerMessageProcessor)
        self.add_route('POST', '/api/context/{id}/v16/getconfiguration', OCPP16GetConfigurationProcessor)
        self.add_route('POST', '/api/context/{id}/v16/getcompositeschedule', OCPP16GetCompositeScheduleProcessor)
        self.add_route('POST', '/api/context/{id}/v16/getdiagnostics', OCPP16GetDiagnosticsProcessor)
        self.add_route('POST', '/api/context/{id}/v16/getlocallistversion', OCPP16GetLocalListVersionProcessor)
        self.add_route('POST', '/api/context/{id}/v16/heartbeat', OCPP16HeartbeatProcessor)
        self.add_route('POST', '/api/context/{id}/v16/reset', OCPP16ResetProcessor)
        self.add_route('POST', '/api/context/{id}/v16/reservenow', OCPP16ReserveNowProcessor)
        self.add_route('POST', '/api/context/{id}/v16/remotestarttransaction', OCPP16RemoteStartTransactionProcessor)
        self.add_route('POST', '/api/context/{id}/v16/remotestoptransaction', OCPP16RemoteStopTransactionProcessor)
        self.add_route('POST', '/api/context/{id}/v16/sendlocallist', OCPP16SendLocalListProcessor)
        self.add_route('POST', '/api/context/{id}/v16/setchargingprofile', OCPP16SetChargingProfileProcessor)
        self.add_route('POST', '/api/context/{id}/v16/triggermessage', OCPP16TriggerMessageProcessor)
        self.add_route('POST', '/api/context/{id}/v16/unlockconnector', OCPP16UnlockConnectorProcessor)

        # OCPP v20 API Routes
        self.add_route('POST', '/api/context/{id}/v20/reset', OCPP20ResetProcessor)
        self.add_route('POST', '/api/context/{id}/v20/cancelreservation', OCPP20CancelReservationProcessor)
        self.add_route('POST', '/api/context/{id}/v20/changeavailability', OCPP20ChangeAvailabilityProcessor)
        self.add_route('POST', '/api/context/{id}/v20/clearchargingprofile', OCPP20ClearChargingProfileProcessor)
        self.add_route('POST', '/api/context/{id}/v20/datatransfer', OCPP20SendDataTransferProcessor)
        self.add_route('POST', '/api/context/{id}/v20/reservenow', OCPP20ReserveNowProcessor)
        self.add_route('POST', '/api/context/{id}/v20/setvariables', OCPP20SetVariablesProcessor)
        self.add_route('POST', '/api/context/{id}/v20/getvariables', OCPP20GetVariablesProcessor)
        self.add_route('POST', '/api/context/{id}/v20/getbasereport', OCPP20GetBaseReportProcessor)
        self.add_route('POST', '/api/context/{id}/v20/getreport', OCPP20GetReportProcessor)

        # UI Routes
        self.app.router.add_get('/', lambda request: index(self, request))
        self.app.router.add_get('/chargingstations', lambda request: chargingstations(self, request))
        self.app.router.add_get('/chargingstations/{id}', lambda request: chargingstation_view(self, request))
        self.app.router.add_get('/chargingstations/{id}/error_viewer', lambda request: error_viewer(self, request))
        self.app.router.add_get('/chargingstations/{id}/message_editor_v16', lambda request: message_editor_v16(self, request))
        self.app.router.add_get('/chargingstations/{id}/message_editor_v20', lambda request: message_editor_v20(self, request))
        self.app.router.add_get('/chargingstations/{id}/analytics', lambda request: analytics(self, request))
        self.app.router.add_get('/authidtags', lambda request: authidtags(self, request))
        self.app.router.add_get('/api', lambda request: api(self, request))
        self.app.router.add_get('/status', lambda request: status(self, request))
        self.app.router.add_get('/settings', lambda request: settings(self, request))
        self.app.router.add_static('/static', Path(__file__).parents[0] / "static")

        cors = aiohttp_cors.setup(self.app, defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers=["Access-Control-Allow-Origin", "Cross-Origin-Resource-Policy = cross-origin"],
            )
        })

        self.routes = self.app.router.routes()

        for route in list(self.routes):
            cors.add(route)

        if self.context_manager is not None:
            config = await self.context_manager.get_webservice_config()
            if config is not None:
                await web._run_app(self.app, **config)
        else:
            await web._run_app(self.app, host="0.0.0.0", port=8080)