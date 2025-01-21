# OCPP Compote

**A Python-based test toolkit to analyze and troubleshoot communication between roles in the e-mobility domain.**

# Overview
![Info](compote/tmp/info.png)

OCPP Compote is designed to test the interactions between:
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

6. [Notes and License](#6-notes-and-license)

---

# 1. Features

- **Charging Station Management System (CSMS)** for testing charging station communication behavior (OCPP 1.6J and OCPP 2.0.1 (Basic Functionality).  
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

- **Protocols:** OICP 2.3 (currently EMP functionalities are supported) based on [Hubject OpenAPI specs](https://hubject.github.io/oicp-emp-2.3-api-doc).

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
Please see the requirements.txt file and install with: 
```bash
pip install -r requirements.txt
```
Please use a Python version 3.10+.

---

#  5. Usage

## 5.1 CSMS (CPO) Service
OCPP Compote utilizes the [Mobility House OCPP library](https://github.com/mobilityhouse/ocpp) for OCPP communication of CSMS with charge points.
Navigate to the root directory, and launch via
```bash
uvicorn compote.csms.csms_engine:app --reload --log-level error --port 8001
```

###  Configuration
Configure the csms service using the json file tmp/config_csms_16.json.

###  OCPP CSMS
Connect OCPP-compatible charging stations via Websocket to [ws://localhost:8001/ocpp](ws://localhost:8001/ocpp).

###  Web UI
Point your browser to http://localhost:8001/ui.

###  REST API
For CSMS instrumentation, a REST API is accessible via http://localhost:8001/api.

The Swagger API documentation is accessible via http://localhost:8001/api/docs. 


## 5.2 EMPMS (EMP) Service
For EMP Service provision, OCPP Compote utilizes the [OICP EMP OpenAPI specifications](https://hubject.github.io/oicp-emp-2.3-api-doc/) provided by Hubject. Navigate to the root directory, and launch via
```bash
uvicorn compote.emp.emp_engine:app --reload --log-level error --port 8000
```

###  Configuration
Configure the emp service using the json file tmp/config_emp.json.

###  OICP ERoaming
Default connection to provided mock ERoaming service available under [http://localhost:8000/oicp](http://localhost:8000/oicp).

###  Web UI
Point your browser to http://localhost:8000/gui.

###  REST API
APIs are accessible via http://localhost:8000/ as well as http://localhost:8000/api.

The Swagger API documentation is accessible via http://localhost:8000/docs and http://localhost:8000/api/docs.


## 5.3 ERoaming Mock Service
The ERoaming Mock Service is derived from the Hubject OICP specification and utilizes code generated using the [OpenAPI code generator](https://github.com/OpenAPITools/openapi-generator).

### REST API
API is accessible via http://localhost:8000/oicp.

The Swagger API documentation is accessible via http://localhost:8000/oicp/docs.

---

# 6. Notes and License
This open source project is funded by the German Federal Ministry for Economic Affairs and Climate Action as part of the EMoT project under Grant Agreement No. 01MV21009C.

OCPP Compote is licensed under the MIT license. All the libraries that OCPP Compote may depend on are licensed under the MIT license, except for the JSON Schema Validator, licensed under the BSD 3 Clause license and the ACE editor licensed under the Mozilla tri-license (MPL/GPL/LGPL).