# Chic

Chic is a user interface for CPOs and EMPs that consolidates all other services (CSMS, EMPMS, E-Roaming Mock, EVerest Charging Station Simulator, OCPP Charging Station Simulator, Zipkin) into a unified platform. This integration facilitates straightforward and transparent message exchanges between the roles within the e-mobility domain. Additionally, it enables the display of key metadata for enhanced traceability and analysis.

# Getting Started

## Environment

Please specify all base URLs for the other services as environment variables in a _.env_ file. Your _.env_ file should look like this:

```
NEXT_PUBLIC_CSMS_OCPP=http://localhost:8001/api
NEXT_PUBLIC_CSMS_OICP=http://localhost:8001/oicp_api
NEXT_PUBLIC_CSMS_PNC=http://localhost:8001/pnc_api
NEXT_PUBLIC_EMPMS_OICP=http://localhost:8000/oicp_api
NEXT_PUBLIC_EMP_TEST_TOOLKIT=http://localhost:8000
NEXT_PUBLIC_EMPMS_PNC=http://localhost:8000/pnc_api
NEXT_PUBLIC_EROAMING_OICP=http://localhost:8002/oicp
NEXT_PUBLIC_ZIPKIN=http://localhost:9411/zipkin
NEXT_PUBLIC_CS_EVEREST_MQTT=http://localhost:8004
```

Make sure to specify all of these variables or else chic will not run properly.
Also check that your URLs do not have a trailing /.

## Docker

To start Chic, simply navigate to the `compote/chic` directory and run:

```bash
docker buildx build --platform linux/amd64 -t compote/chic-amd64:latest .
docker run -d -p 3000:3000 compote/chic-amd64
```

Chic should now be available and can be reached by pointing your browser to [`http://localhost:3000`](http://localhost:3000).

## Users and Roles

To use the application properly, users must log in. Each user is assigned a specific role, which determines the content and features available to them. There are three roles: “CPO”, “EMP”, and “CPO&EMP”.
Users with the “CPO&EMP” role have the highest level of access, allowing them to use all pages and functionalities available to both CPOs and EMPs. Users with the “CPO” or “EMP” roles are limited to the sections relevant to their respective domains.

Pages that are exclusively available to either CPOs or EMPs are marked in the navigation menu with an indicator:

- A green indicator denotes pages for CPOs.
- A red indicator denotes pages for EMPs.

![Example Role Indicator](/compote/chic/public/role-indicator.png)

Chic is not currently connected to a real auth backend. The existing users are hardcoded in the [`users.json`](/compote/chic/src/users.json) file.
Refer to the _users.json_ file to get an initial overview of the default users.

If you wish to add, remove, or modify users, you can simply update the _users.json_ file.
Please note: User IDs must be unique and must not be assigned to multiple users.

# Key Components

## Widgets

Each page consists of individual widgets, whose visibility can be configured individually.

When hovering over a widget with the mouse, a red _X icon_ appears in the top-right corner. Clicking this icon will remove the widget from view.
![Widget X-Button](/compote/chic/public/widget-x.png)

To restore hidden widgets, use the _widget selection header_ located at the top of each page.
![Widget Selection Header](/compote/chic/public/widget-selection-header.png)

## Dashboard

The dashboard is the central page of the Chic user interface. It features a topology view of the roles in the e-mobility domain and the communication paths between them, along with their respective protocols.

To send messages across a communication path, click on the arrow representing the desired path and select “Open Message Editor” from the _edge menu_.
![Dashboard Topology Open Message Editor](/compote/chic/public/topology1.png)

To open the Message Editor for communication with EVerest, click on the _CPO node_ and select “Open Everest Message Editor” from the _node menu_.
![Dashboard Topology Open EVerest Message Editor](/compote/chic/public/topology2.png)

## Message Editor

The Message Editor component is reused across multiple pages (including the dashboard) and enables structured message sending across all available communication paths.

Whether a user is authorized to send messages over a specific communication path depends on their assigned role.
For example, a user with the “EMP” role cannot send messages over the communication path between charging stations and CPO.

### Usage

All protocols available for the current use case can be selected from the dropdown menu in the top-right corner of the widget.
![Message Editor Select Protocol](/compote/chic/public/editor1.png)

Once a protocol is selected, the corresponding message types become available. After selecting a message, a form tailored to that message appears on the right.
Click “Send” to dispatch the message.

### Visualization

Wherever the Message Editor is used, a _Message Sequence Visualization_ component is also available. It displays all sent messages and their corresponding responses, along with important metadata.

This visualization includes a sequence diagram to provide a clear overview of message flow.
![Message Sequence Visualization](/compote/chic/public/editor2.png)

# Tech Stack

Chic is built with [`React`](https://react.dev) 18 and [`Next.js`](https://nextjs.org) 14.

Most components are based on [`Mantine`](https://mantine.dev) 7, with nearly all icons sourced from [`Tabler Icons`](https://tabler.io/icons).

Topologies are constructed using [`React Flow`](https://reactflow.dev) 12 and [`PatternFly`](https://www.patternfly.org) 6.

The _CSMap_ component, included on the _EMP Page_, leverages [`Leaflet`](https://leafletjs.com) for interactive maps.

All forms, including those in the _Message Editor_, are dynamically rendered using [`JSON Forms`](https://jsonforms.io).

The sequence diagram in the _Message Sequence Visualization_ is generated using [`Mermaid`](https://mermaid.js.org).
