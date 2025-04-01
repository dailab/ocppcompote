# OCPP Compote

**A Python-based test toolkit to analyze and troubleshoot communication between roles in the e-mobility domain.**

# Overview
![Info](compote/tmp/info.png)

OCPP Compote is designed to test system interactions between:
- **Charge Points**,
- **Charging Point Operators (CPOs)**,
- **Electro-Mobility Providers (EMPs)**, and
- **ERoaming Services**.

It provides partial backend implementations for CPOs and EMPs, allowing assement and testing of communication scenarios and behaviors using the [Open Charge Point Protocol (OCPP)](https://www.openchargealliance.org/protocols/ocpp-16/) and the [Open Intercharge Protocol (OICP)](https://hubject.github.io/oicp-emp-2.3-api-doc).

# Table of Contents
1. [Features](#1-features)
2. [OCPP Support](#2-ocpp-support)
3. [OICP Support](#3-oicp-support)
4. [Installation](#4-installation)

   4.1 [Local Installation](#41-local-installation)

   4.2 [Dependencies and Requirements](#42-dependencies-and-requirements)

5. [Usage](#5-usage)

   5.1. [CSMS (CPO) Service](#51-csms--cpo--service)

   5.2. [EMPMS (EMP) Service](#52-empms--emp--service)

   5.3. [ERoaming Mock Service](#53-eroaming-mock-service)

   5.4. [Additional Services](#54-additional-services)

6. [Notes and License](#6-notes-and-license)

---

# 1. Features

- **Charging Station Management System (CSMS)** for testing charging station communication behavior (OCPP 1.6J and OCPP 2.0.1 (Basic Functionality) as well as testing CSMS interaction with ERoaming services based on OICP 2.3.
- **Electro-Mobility Provider Management System (EMPMS)** to test EMP interaction with ERoaming services based on OICP 2.3.
- **Mock ERoaming Service** to validate connectivity and data flow for OICP 2.3.
- **REST APIs** for controlling and inspecting the backend behaviors based on [FastAPI](https://fastapi.tiangolo.com).
- **Prototypical Web UIs** to visualize or manually operate systems and services.
- **Observability and Distributed Tracing** using [OpenTelemetry](https://opentelemetry.io) (experimental support).

---

# 2. OCPP Support

- **Protocols:** OCPP 1.6J, OCPP 2.0.1 (basic functionality) based on [Mobility House OCPP library](https://github.com/mobilityhouse/ocpp).

---

# 3. OICP Support

- **Protocols:** OICP 2.3 (currently basic EMP and CPO functionalities are supported) based on [Hubject OpenAPI specs](https://hubject.github.io/oicp-emp-2.3-api-doc).

# 3. Plug-and-Charge Support

- **APIs:** The [Hubject Open Plug&Charge Environment](https://hubject.stoplight.io) is utilized for CSMS communication and obtaining relevant certificates (ISO15118-2).
---

#  4. Installation
Below is a high-level overview of how to set up **OCPP Compote** on your local machine.

## 4.1 Local Installation

1. **Clone the repository**:
```bash
git clone https://github.com/dailab/ocppcompote.git
```
2. **Navigate to the cloned repository**:
```bash
cd ocppcompote
```

##  4.2 Dependencies and Requirements
Please see the `requirements.txt` file and install with:
```bash
pip install -r requirements.txt
```
Please use a Python version 3.10+.

---

#  5. Usage

## 5.1 CSMS (CPO) Service
OCPP Compote utilizes the [Mobility House OCPP library](https://github.com/mobilityhouse/ocpp) for OCPP communication of CSMS with charge points. In addition, OCPP Compote utilizes the [OICP CPO OpenAPI specifications](https://hubject.github.io/oicp-cpo-2.3-api-doc/) provided by Hubject.
Navigate to the root directory, and launch via
```bash
uvicorn compote.csms.csms_engine:app --reload --log-level error --port 8001
```

### Configuration
Configure the csms service using the JSON file `tmp/config_csms_16.json`.

### OCPP CSMS
Connect OCPP-compatible charging stations via Websocket to [`ws://localhost:8001/ocpp`](ws://localhost:8001/ocpp).

### Web UI
Point your browser to [`http://localhost:8001/ui`](http://localhost:8001/ui).

### REST API
* `http://localhost:8001/api`: CSMS Management and OCPPv16/v201 REST API
  * `http://localhost:8001/api/docs`: [Swagger API Documentation](http://localhost:8001/api/docs)
* `http://localhost:8001/oicp_api`:  CSMS OICP API
  * `http://localhost:8001/oicp_api/docs`: [Swagger API Documentation](http://localhost:8001/oicp_api/docs)
* `http://localhost:8001/pnc_api`:  CSMS PnC API
  * `http://localhost:8001/pnc_api/docs`: [Swagger API Documentation](http://localhost:8001/pnc_api/docs)

### Logging
Log files for the CSMS (`csms_engine.py_*.log`) are provided in the `/tmp` folder.

## 5.2 EMPMS (EMP) Service
For EMP Service provision, OCPP Compote utilizes the [OICP EMP OpenAPI specifications](https://hubject.github.io/oicp-emp-2.3-api-doc/) provided by Hubject. Navigate to the root directory, and launch via
```bash
uvicorn compote.emp.emp_engine:app --reload --log-level error --port 8000
```

###  Configuration
Configure the emp service using the JSON file `tmp/config_emp.json`.

###  Web UI
Point your browser to [`http://localhost:8000/gui`](http://localhost:8000/gui).

###  REST API
* `http://localhost:8000/`: EMPMS Management API
  * `http://localhost:8000/docs`: [Swagger API Documentation](http://localhost:8000/docs)
* `http://localhost:8000/oicp_api`:  EMPMS OICP API
  * `http://localhost:8000/oicp_api/docs`: [Swagger API Documentation](http://localhost:8000/oicp_api/docs)
* `http://localhost:8000/pnc_api`:  EMPMS PnC API
  * `http://localhost:8000/pnc_api/docs`: [Swagger API Documentation](http://localhost:8000/pnc_api/docs)

### Logging
Log files for the EMPMS (`emp_engine.py_*.log`) are provided in the `/tmp` folder.


## 5.3 ERoaming Mock Service
The ERoaming Mock Service is derived from the Hubject OICP specification and utilizes code generated using the [OpenAPI code generator](https://github.com/OpenAPITools/openapi-generator).
```bash
uvicorn compote.eroaming.mock_eroaming_engine:app --reload --log-level error --port 8002
```

###  Configuration
Configure the e-roaming service using the JSON file `tmp/config_eroaming.json`.

### REST API
* `http://localhost:8002/oicp`: Mock E-Roaming OICP API
  * `http://localhost:8002/oicp/docs`: [Swagger API Documentation](http://localhost:8002/oicp/docs)

### Logging
Log files for the Mock E-Roaming Service (`mock_eroaming_engine.py_*.log`) are provided in the `/tmp` folder.


## 5.4 Additional Services

### 5.4.1 MQTT Communication Adapter for EVerest

Please refer to the [`README.md`](compote/cs_everest/README.md) file in the `cs_everest` folder.

### 5.4.2 OCPP Charging Station Simulator

A basic OCPP 1.6 charging station simulator is provided in the `cs` folder.

Navigate to the cs folder and launch as follows:
```bash
python3 cs_engine.py
```

#### Configuration
Configure the charging station simulator using the JSON file `cs/tmp/config_cs.json`.

### 5.4.3 Zipkin
[Zipkin](https://zipkin.io) can be utilized to view OpenTelemetry traces for the service architecture.
To use Zipkin follow the instructions provided on https://github.com/openzipkin/zipkin.
For using an already assembled Zipkin Docker container run:

```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```

Using their default configuration, the services are configured to utilize Zipkin automatically.

---

# 6. Notes and License
This open source project is funded by the German Federal Ministry for Economic Affairs and Climate Action as part of the EMoT project under Grant Agreement No. 01MV21009C.

OCPP Compote is licensed under the MIT license. All the libraries that OCPP Compote may depend on are licensed under the MIT license, except for the JSON Schema Validator, licensed under the BSD 3 Clause license and the ACE editor licensed under the Mozilla tri-license (MPL/GPL/LGPL). Additionally, EVerest is licensed under Apache-2.0 license.