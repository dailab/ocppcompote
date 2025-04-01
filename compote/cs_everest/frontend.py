import logging

from fastapi import FastAPI

from nicegui import app, ui

from compote.cs_everest.context.cs_everest_context import get_shared_context
from compote.cs_everest.mqttservice.mqttserviceroutes import startcharging, unplug
from compote.cs_everest.mqttservice.mqttserviceroutes import startchargingiso15118
from compote.cs_everest.mqttservice.mqttserviceroutes import authorize
from compote.shared.helper_functions import log_json_sync

logging.getLogger('niceGUI').setLevel(logging.WARNING)

actions = []

def init(fastapi_app: FastAPI, context = None) -> None:

    def get_logfile():
        log = log_json_sync(context.data["config"]["logfile_name"])
        return log

    async def clear():
        context.data["root"] = {}
        await refresh_ui()

    async def refresh_ui():
        cs_commands_ui.refresh()
        statuslog_ui.refresh()
        messages_ui.refresh()

    async def authorize_send(auth_id = "ABC12345", connector_id: int = 1):
        await authorize(token=auth_id, context=get_shared_context(), connector_id=connector_id)
        messages_ui.refresh()

    async def startcharging_send(connector_id: int = 1):
        await startcharging(context=get_shared_context(), connector_id=connector_id)
        messages_ui.refresh()

    async def startchargingiso15118_send(connector_id: int = 1):
        await startchargingiso15118(context=get_shared_context(), connector_id=connector_id)
        messages_ui.refresh()

    async def unplug_send(connector_id: int = 1):
        await unplug(context=get_shared_context(), connector_id=connector_id)
        messages_ui.refresh()

    ui.add_css('''
        .padding {
            padding: 2em;
        }
    ''')

    @ui.refreshable
    def configuration_ui():
        ui.label('Configuration')
        ui.json_editor({'content': {'json': context.data["config"]}}).classes('w-full')

    @ui.refreshable
    def contextview_ui():
        ui.label('Context')
        ui.json_editor({'content': {'json': context.data}}).classes('w-full')

    @ui.refreshable
    def messages_ui():
        ui.label('Current Messages')
        messages = context.data["messages"]
        ui.json_editor({'content': {'json': messages}}).classes('w-full')

    @ui.refreshable
    def statuslog_ui():
        ui.label('Logging')
        ui.json_editor({'content': {'json': get_logfile()}}).classes('w-full')

    @ui.refreshable
    def connector_state_ui():
        with ui.grid(columns=2):
            for key, value in context.data["state"].items():
                ui.input(label=f"Connector {key} State", value=value).props('outlined dense')

    @ui.refreshable
    def cs_commands_ui():
        state = {"connector_id": 1, "auth_id" : "ABC12345"}

        def set_connector_id(new_connector_id):
            if new_connector_id != '':
                state["connector_id"] = int(new_connector_id)

        def set_auth_id(new_auth_id):
            if new_auth_id != '':
                state["auth_id"] = str(new_auth_id)

        connector_state_ui()

        ui.input(label="Connector ID", value=str(state["connector_id"]),
                 on_change=lambda e: set_connector_id(e.value)).props(
            'rounded outlined dense')

        ui.input(label="Auth ID", value=str(state["auth_id"]),
                 on_change=lambda e: set_auth_id(e.value)).props(
            'rounded outlined dense')

        with ui.grid(columns=4):
            ui.button('Authorize', on_click=lambda: authorize_send(state["auth_id"], state["connector_id"]))
            ui.button('Start Charging', on_click=lambda: startcharging_send(state["connector_id"]))
            ui.button('Start Charging ISO15118', on_click=lambda: startchargingiso15118_send(state["connector_id"]))
            ui.button('Unplug', on_click=lambda: unplug_send(state["connector_id"]))

    @ui.page('/')
    def show():
        ui.page_title('Overview')

        with ui.header().classes(replace='row items-center') as header:
            ui.button(on_click=lambda: left_drawer.toggle(), icon='menu').props('flat color=white')
            with ui.tabs() as tabs:
                ui.tab('CS Everest')
                ui.tab('API Docs')
                ui.tab('CPO PnC API')
                ui.tab('EMP PnC API')
                ui.tab('OEM PnC API')
                ui.tab('Everest UI')
                ui.tab('Telemetry')

        with ui.footer(value=False) as footer:
            ui.label('Footer')

        with ui.left_drawer(value=False).classes('bg-blue-100') as left_drawer:
            ui.label('Side menu')
            ui.dark_mode().bind_value(app.storage.user, 'dark_mode')
            ui.checkbox('dark mode').bind_value(app.storage.user, 'dark_mode')

        with ui.page_sticky(position='bottom-right', x_offset=20, y_offset=20):
            ui.button(on_click=footer.toggle, icon='contact_support').props('fab')

        with ui.tab_panels(tabs, value='CS Everest').classes('w-full'):
            with ui.tab_panel('CS Everest'):
                with ui.grid(columns=2).classes('w-full'):
                    with ui.column().classes('w-full'):
                        with ui.expansion('Commands', icon='settings', value="true").classes('w-full border'):
                            cs_commands_ui()

                    with ui.column().classes('w-full'):
                        with ui.expansion('Configuration', icon='settings').classes('w-full border'):
                            configuration_ui()

                        with ui.column().classes('w-full'):
                            with ui.expansion('Context View', icon='info').classes('w-full border'):
                                contextview_ui()

                        with ui.column().classes('w-full'):
                            with ui.expansion('Messages', icon='info').classes('w-full border'):
                                messages_ui()


                        with ui.expansion('Status Log', icon='error', value=True).classes('w-full border'):
                            statuslog_ui()

            with ui.tab_panel('API Docs'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:8004/docs" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

            with ui.tab_panel('Everest UI'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:1880/ui" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

            with ui.tab_panel('CPO PnC API'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:8001/pnc_api/docs" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

            with ui.tab_panel('EMP PnC API'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:8000/pnc_api/docs" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

            with ui.tab_panel('OEM PnC API'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:8004/pnc_api/docs" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

            with ui.tab_panel('Telemetry'):
                ui.html('''
                    <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
                        <iframe src="http://localhost:9411/" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                ''').classes('w-full h-full flex p-0')

        ui.timer(5.0, messages_ui.refresh)
        ui.timer(5.0, contextview_ui.refresh)
        ui.timer(1.0, connector_state_ui.refresh)

        ui.run()

    ui.run_with(
        fastapi_app,
        mount_path='/gui',
        storage_secret='',
    )