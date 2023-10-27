# OCPP Compote

OCPP Compote is a Python-based test-toolkit for the [Open Charge Point Protocol (OCPP)](https://www.openchargealliance.org/protocols/ocpp-16/) aiming to analyze and troubleshoot charging station behavior. 


For this, it provides an implementation of communication-relevant components of a backend for charging point operators (CPOs), i.e. a charging station management system. Both prototypical Web-UI and REST API are provided. 

OCPP Compote utilizes the [Mobility House OCPP library](https://github.com/mobilityhouse/ocpp).

## Table of Contents
- [OCPP Support](#ocpp-support)
- [Installation](#installation)
- [Usage](#usage)
- [Notes and License](#notes-and-license)

## OCPP Support
OCPP-1.6J and OCPP2.0.1 Basic Functionality. 

##  Installation

### Local Installation

1. Navigate to the desired destination directory.
2. Clone the repository:
```bash
git clone https://github.com/dailab/ocppcompote.git
```
###  Dependencies and Requirements
Please see the requirements.txt file. The following packages that are crucial for the project:
* Python 3.10+
* ocpp (Mobilityhouse/ocpp)
* aiohttp 
* aiohttp-cors
* aiohttp-jinja2
* numpy
* greenlet

## Usage
Launch csms/csms_engine.py.

###  OCPP CSMS
Connect OCPP-compatible charging stations via Websocket to [ws://localhost:9000](ws://localhost:9000).

###  Web UI
Point your browser to http://localhost:8080.

###  REST API
API is accessible via http://localhost:8080/api.


## Notes and License
This open source project is funded by the German Federal Ministry for Economic Affairs and Climate Action as part of the EMoT project under Grant Agreement No. 01MV21009C.

OCPP Compote is licensed under the MIT license. All the libraries that OCPP Compote may depend on are licensed under the MIT license, except for the JSON Schema Validator, licensed under the BSD 3 Clause license and the ACE editor licensed under the Mozilla tri-license (MPL/GPL/LGPL).