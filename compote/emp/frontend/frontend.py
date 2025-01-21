import logging

from fastapi import FastAPI

from nicegui import app, ui

from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_evse_data import ERoamingEVSEData
from compote.eroaming.models.e_roaming_evse_pricing import ERoamingEVSEPricing
from compote.eroaming.models.e_roaming_pricing_product_data import \
    ERoamingPricingProductData
from compote.eroaming.models.e_roaming_pull_evse_status import ERoamingPullEVSEStatus
from compote.emp.empoicpservice.authenticationroutes import eRoamingPushAuthenticationData_V21, \
    DEFAULT_PUSH_AUTHENTICATION_DATA
from compote.emp.empoicpservice.evsestatusroutes import eRoamingPullEvseData_V23, DEFAULT_PULL_EVSE_DATA, \
    eRoamingPullEvseStatus_V21, DEFAULT_PULL_EVSE_STATUS_DATA
from compote.emp.empoicpservice.pricingroutes import DEFAULT_PRICING_PRODUCT_DATA, eRoamingPullPricingProductData_V10, \
    eRoamingPullEVSEPricing_V10, DEFAULT_PRICING_EVSE_DATA
from compote.emp.empoicpservice.remoteauthorizationroutes import eRoamingAuthorizeRemoteStop_v21, \
    DEFAULT_AUTHORIZE_REMOTE_STOP_DATA, DEFAULT_AUTHORIZE_REMOTE_START_DATA, eRoamingAuthorizeRemoteStart_v21
from compote.emp.empoicpservice.reservationroutes import DEFAULT_AUTHORIZE_REMOTE_RESERVATION_START, \
    DEFAULT_AUTHORIZE_REMOTE_RESERVATION_STOP, eRoamingAuthorizeRemoteReservationStart_V11, \
    eRoamingAuthorizeRemoteReservationStop_V1
from compote.shared.helper_functions import log_json_sync

logging.getLogger('niceGUI').setLevel(logging.WARNING)

actions = []

def init(fastapi_app: FastAPI, context = None) -> None:

    def get_logfile():
        log = log_json_sync(context.data["config"]["logfile_name"])
        return log

    async def clear():
        context.data["root"] = {}
        context.data["coordinates"]["latitude"] = 0.0
        context.data["coordinates"]["longitude"] = 0.0
        context.currentresponse = {}
        context.currentrequest = {}
        await refresh_ui()

    # OICP Ops
    async def pull_evse_data():
        body = DEFAULT_PULL_EVSE_DATA
        result: ERoamingEVSEData = await eRoamingPullEvseData_V23(providerID=context.data["providerId"], body=None, context=context)
        context.data["root"] = result["content"]
        await refresh_ui()

    async def pull_evse_status():
        body = DEFAULT_PULL_EVSE_STATUS_DATA
        result: ERoamingPullEVSEStatus = await eRoamingPullEvseStatus_V21(providerID=context.data["providerId"], body=None, context=context)
        ui.navigate.reload()

    async def push_authentication_data():
        body = DEFAULT_PUSH_AUTHENTICATION_DATA
        result: ERoamingAcknowledgment = await eRoamingPushAuthenticationData_V21(providerID=context.data["providerId"], body=None, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    # TODO UserID
    async def authorize_remote_start(evse_id, auth_id = None, user_id = None):
        body = DEFAULT_AUTHORIZE_REMOTE_START_DATA
        body.evse_id = evse_id
        result: ERoamingAcknowledgment = await eRoamingAuthorizeRemoteStart_v21(
            providerID=context.data["providerId"], body=body, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    # TODO ExternalID
    async def authorize_remote_stop(evse_id):
        body = DEFAULT_AUTHORIZE_REMOTE_STOP_DATA
        body.evse_id = evse_id
        result: ERoamingAcknowledgment = await eRoamingAuthorizeRemoteStop_v21(
            externalID=context.data["providerId"], body=body, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    # TODO UserID
    async def authorize_remote_reservation_start(evse_id, auth_id = None, user_id = None):
        body = DEFAULT_AUTHORIZE_REMOTE_RESERVATION_START
        body.evse_id = evse_id
        result: ERoamingAcknowledgment = await eRoamingAuthorizeRemoteReservationStart_V11(
            providerID=context.data["providerId"], body=body, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    # TODO ExternalID
    async def authorize_remote_reservation_stop(evse_id):
        body = DEFAULT_AUTHORIZE_REMOTE_RESERVATION_STOP
        body.evse_id = evse_id
        result: ERoamingAcknowledgment = await eRoamingAuthorizeRemoteReservationStop_V1(
            providerID=context.data["providerId"], body=body, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    async def pull_pricing_product_data(operator_id):
        body = DEFAULT_PRICING_PRODUCT_DATA
        body.operator_ids = [operator_id]
        result: ERoamingPricingProductData = await eRoamingPullPricingProductData_V10(
            providerID=context.data["providerId"], body=body, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    async def pull_evse_pricing(operator_id):
        body = DEFAULT_PRICING_EVSE_DATA
        body.operator_ids = [operator_id]
        body.provider_id = context.data["providerId"]
        result: ERoamingEVSEPricing = await eRoamingPullEVSEPricing_V10(
            providerID=context.data["providerId"], body=body, context=context)
        currentresponse_ui.refresh()
        currentrequest_ui.refresh()

    async def refresh_ui():
        map_ui.refresh()
        chargingstations_ui.refresh()
        currentresponse_ui.refresh()
        chargingstationcommands_ui.refresh()
        cpo_commands.refresh()
        currentrequest_ui.refresh()
        statuslog_ui.refresh()
        chargedetailrecords_ui.refresh()
        chargingnotifications_ui.refresh()

    async def set_providerId(id):
        context.data["providerId"] = id

    ui.add_css('''
        .padding {
            padding: 2em;
        }
    ''')

    @ui.refreshable
    def map_ui():
        ui.label('Charging Station Overview')
        m = ui.leaflet(center=(52.520, 13.405)).classes('w-full')

        for cs in context.data["root"]:
            latitude = cs["GeoCoordinates"]["DecimalDegree"]["Latitude"]
            longitude = cs["GeoCoordinates"]["DecimalDegree"]["Longitude"]
            m.marker(latlng=(latitude, longitude),
                 options={})

        with ui.grid(columns=2):
            ui.button('London', on_click=lambda: m.set_center((51.505, -0.090)))
            ui.button('Berlin', on_click=lambda: m.set_center((52.520, 13.405)))

    @ui.refreshable
    def configuration_ui():
        ui.label('Configuration')
        ui.input(value=context.data["providerId"], on_change=lambda e: set_providerId(e.value)).props(
            'rounded outlined dense')
        ui.json_editor({'content': {'json': context.data}}).classes('w-full')

    @ui.refreshable
    def chargingstations_ui():
        ui.label('Charging Station Data')
        ui.json_editor({'content': {'json': context.data["cs_data"]}}).classes('w-full')

    @ui.refreshable
    def currentresponse_ui():
        ui.label('Current Response')
        ui.json_editor({'content': {'json': context.currentresponse}}).classes('w-full')

    @ui.refreshable
    def currentrequest_ui():
        ui.label('Current Request')
        ui.json_editor({'content': {'json': context.currentrequest}}).classes('w-full')

    @ui.refreshable
    def statuslog_ui():
        ui.label('Logging')
        ui.json_editor({'content': {'json': get_logfile()}}).classes('w-full')

    @ui.refreshable
    def authidtags_ui():
        with ui.label("Authentication Data Records "):
            badge = ui.badge('1', color='red')
            badge.set_text(len(context.data["authentication_data_records"]))

        ui.json_editor({'content': {'json': context.data["authentication_data_records"]}}).classes('w-full')

    @ui.refreshable
    def users_ui():
        with ui.label("Users"):
            badge = ui.badge('1', color='red')
            badge.set_text(len(context.data["config"]["users"]))

        ui.json_editor({'content': {'json': context.data["config"]["users"]}}).classes('w-full')

    @ui.refreshable
    def chargedetailrecords_ui():
        with ui.label("Charge Detail Records"):
            badge = ui.badge('1', color='red')
            badge.set_text(len(context.data["cdrs"]))

        ui.json_editor({'content': {'json': context.data["cdrs"]}}).classes('w-full')

    @ui.refreshable
    def chargingnotifications_ui():
        with ui.label("Charging Notifications"):
            badge = ui.badge('1', color='red')
            badge.set_text(len(context.data["charging_notifications"]))

        ui.json_editor({'content': {'json': context.data["charging_notifications"]}}).classes('w-full')

    @ui.refreshable
    def cpo_commands():
        chargingstations = context.data["root"]

        listresult = []
        for cs in chargingstations:
            if cs["OperatorID"] not in listresult:
                listresult.append(cs["OperatorID"])

        ui.select(options=listresult, with_input=True, on_change=lambda e: cpo_commands_details(e.value)).classes('w-40')

    @ui.refreshable
    def cpo_commands_details(operator_id):
        with ui.grid(columns=8):
            ui.button('Pull Pricing Product Data', on_click=lambda: pull_pricing_product_data(operator_id))
            ui.button('Pull EVSE Pricing', on_click=lambda: pull_evse_pricing(operator_id))


    @ui.refreshable
    def chargingstationcommands_ui():
        chargingstations = context.data["root"]
        #users = context.data["config"]["users"]

        listresult = []
        for cs in chargingstations:
            listresult.append(cs["EvseID"])

        ui.select(options=listresult, with_input=True, on_change=lambda e: chargingstationcommands_detail_ui(e.value)).classes('w-40')

    @ui.refreshable
    def chargingstationcommands_detail_ui(id):
        with ui.grid(columns=8):
            ui.button('Remote Auth Start', on_click=lambda: authorize_remote_start(id))
            ui.button('Remote Auth Stop', on_click=lambda: authorize_remote_stop(id))
            ui.button('Auth Remote Reservation Start', on_click=lambda: authorize_remote_reservation_start(id))
            ui.button('Auth Remote Reservation Stop', on_click=lambda: authorize_remote_reservation_stop(id))

    @ui.page('/')
    def show():
        ui.page_title('Overview')

        with ui.header().classes(replace='row items-center') as header:
            ui.button(on_click=lambda: left_drawer.toggle(), icon='menu').props('flat color=white')
            with ui.tabs() as tabs:
                ui.tab('EMP')
                ui.tab('Telemetry')

        with ui.footer(value=False) as footer:
            ui.label('Footer')

        with ui.left_drawer(value=False).classes('bg-blue-100') as left_drawer:
            ui.label('Side menu')
            ui.dark_mode().bind_value(app.storage.user, 'dark_mode')
            ui.checkbox('dark mode').bind_value(app.storage.user, 'dark_mode')

        with ui.page_sticky(position='bottom-right', x_offset=20, y_offset=20):
            ui.button(on_click=footer.toggle, icon='contact_support').props('fab')

        with ui.tab_panels(tabs, value='EMP').classes('w-full'):
            with ui.tab_panel('EMP'):
                with ui.grid(columns=2).classes('w-full'):
                    with ui.column().classes('w-full'):
                        with ui.expansion('Commands', icon='settings', value="true").classes('w-full border'):
                            with ui.grid(columns=8):
                                ui.button('Clear', on_click=lambda: clear())
                                ui.button('Pull EVSE Data', on_click=lambda: pull_evse_data())
                                ui.button('Pull EVSE Status Data', on_click=lambda: pull_evse_status())
                                ui.button('Push Auth Data', on_click=lambda: push_authentication_data())

                        with ui.expansion('CPO Commands', icon='settings').classes('w-full border'):
                            cpo_commands()

                        with ui.expansion('Charging Station Commands', icon='settings').classes('w-full border'):
                            chargingstationcommands_ui()

                        with ui.expansion('Charging Station Map', icon='map', value=True).classes('w-full border'):
                            map_ui()

                        with ui.expansion('Total Charging Station Information', icon='ev_station').classes('w-full border'):
                            chargingstations_ui()

                        with ui.expansion('Charging Notifications', icon='ev_station').classes('w-full border'):
                            chargingnotifications_ui()

                        with ui.expansion('Charge Detail Records', icon='ev_station').classes('w-full border'):
                            chargedetailrecords_ui()

                        with ui.expansion('Auth ID Tags', icon='key').classes('w-full border'):
                            authidtags_ui()

                        with ui.expansion('Users', icon='person').classes('w-full border'):
                            users_ui()


                    with ui.column().classes('w-full'):
                        with ui.expansion('Configuration', icon='settings').classes('w-full border'):
                            configuration_ui()

                        with ui.expansion('Current Request', icon='input', value=False).classes('w-full border'):
                            currentrequest_ui()

                        with ui.expansion('Current Response', icon='output', value=True).classes('w-full border'):
                            currentresponse_ui()

                        with ui.expansion('Status Log', icon='error', value=True).classes('w-full border'):
                            statuslog_ui()

            with ui.tab_panel('Telemetry'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:9411/" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

        ui.run()

    ui.run_with(
        fastapi_app,
        mount_path='/gui',
        storage_secret='',
    )