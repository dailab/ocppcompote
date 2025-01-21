# coding: utf-8

"""
    EMP OICP-2.3

    ## Introduction  ### The Hubject Platform  The goal of the “Hubject B2B Service Platform (HBS)” is to enable the electric mobility market by providing an information and transactional gateway for businesses such as charging infrastructure providers, mobility service providers and vehicle manufacturers.  ![Hubject Process](images/hubject_1.png)  The platform enabler functions include:   - Ensuring the interoperability of the public and semi-public infrastructure by promoting accepted standards  within the network and open business user interfaces to the platform  - Simplification of authentication and authorization procedures through a trustworthy instance as well as safekeeping of sensitive data through the uncoupling of personal data and anonymous user data  - Automation of contract-based business relationships between power suppliers, car manufacturers, infrastructure service providers as well as further mobility business partners.  - B2B information service for the realization of advanced services within the areas of energy management, traffic management, vehicle reservations, intelligent charging, car sharing and intermodal mobility  ### The Emobility Service Provider (EMP) As an EMP you profit from our solution CONNECT. It allows you to offer EV drivers access to public charging infrastructure across national borders. Your customers will be able to identify any available charging point through our easily recognizable compatibility symbol, the intercharge logo. By getting connected to the intercharge network your customers will be able to use every charge point of all participating CPOs via eRoaming.  For this purpose, you need to be onboarded to the eRoaming platform HBS (Hubject Brokering System). The HBS functions as an open emobility market place, which creates an open synergetic network that everyone profits from in the end.  In general, there are two different possibilities to be connected to the HBS as an EMP.  ##### Offline EMP:  The so called offline EMP has no real-time connection for authorization to the Hubject platform. This means that authentication data for the authorization MUST be sent and stored on the Hubject platform via the eRoamingPushAuthenticationData. The HBS will authorize charging sessions locally on the platform. Nevertheless, there can be a real-time connection for pulling dynamic POI data. Furthermore, the CDRs, resulting from each charging session, will not be directly forwarded to the EMP but will also be stored on the HBS. The EMP can then download these CDRs on demand via the eRoamingGetChargeDetailRecords service.  ##### Online EMP: The so called online EMP is fully connected to the HBS via a real-time interface. This means that authorization requests are forwarded to the EMP’s system in real-time. To ensure the online authorization, the EMP MUST implement the holistic authorization web service. Furthermore, the CDRs created for each charging session will be directly forwarded to the EMP’s system. Therefore, online EMP’s MUST implement the eRoamingChargeDetailRecord service. ### Scope  The information exchange between Hubject and CPO systems is entirely based on web service communication. This document describes the relevant service interfaces for CPO. The Open InterCharge Protocol (OICP) is the most widely implemented communication standard between EMP and CPO systems.  The information exchange is, in most cases, based on contractual relationships between EMPs and CPOs. In these cases, Hubject only processes service requests if there is a valid contract for the requested service. How EMPs and CPOs manage their service contracts is out of the scope of this document because the contract management aspects of the platform are used via a GUI-based system component.  ### Conventions  The key words `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY` and `OPTIONAL` in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).    ### Overview  The following diagram gives an overview of all service operation messages that can be exchanged between Hubject and the corresponding EMP, respectively CPO systems.  The chapter [Services and Operations](02_EMP_Services_and_Operations.asciidoc) introduces the supported web services and the corresponding service operations in detail and defines the messages that will be exchanged between Hubject and partner systems. Chapter [Data Types](03_EMP_Data_Types.asciidoc) specifies the data types of the messages inclueing details the required Data Types. Furthermore, every service is described in detail by a business process diagram, which is part of the appendix.  ![Hubject Web Services Diagram](images/web_services.png)  ### Release management    Hubject intends to pursue a release frequency; whereby, a new update of the OICP can be done within a time frame of two years with the HBS. The frequency of releases to be expected in the future should however not result in additional implementation complexity for partners, since each new release will lead to a new version of the affected services that will run in parallel to the current service version. Consequently, partners do not need to perform an upgrade with each new release, but will rather have the flexibility to choose which of the available valid service versions they wish to use. Service validity is dependent on the OICP version with which they are released (i.e. service versions available in deprecated OICP versions are only considered invalid and will not be supported by the HBS). Only service versions available in active OICP versions shall be supported. Each OICP version MUST be supported for two years by the HBS.   See below for an example of the implications of the HBS release management approach (note: the dates and content in the diagram below are strictly meant for explanation purposes only. This is not to be considered as an official communication of release dates):  *NOTE*:  >_the dates and content in the diagram below are strictly meant for explanation purposes only. This is not to be considered as an official communication of release dates_   ![OICP Versions Release](images/oicp_version_release_example.png)  * Service versions: in this example, assuming the current date is October 15th 2021, only service versions highlighted in green will be supported by the HBS; whereas services highlighted in grey will no longer be supported, since these service versions are only available in deprecated OICP versions (i.e. the OICP versions highlighted in red). Consequently, partners can choose one of 3 valid service versions to implement for “Service A”, and one of 2 valid versions for “Service B” and “Service C”.  * OICP versions: the OICP versions highlighted in red will not be supported by the HBS assuming the current date is 15th October 2021 since they are old therefore deprecated. Also, as depicted in the above example and in contrast to the HBS release management approach, more than two OICP versions can be supported simultaneously going forward.  All partners using the HBS `MUST` indicate the OICP version they are currently running in their system (i.e. OICP version being used in the communication with the HBS). On the database level however, the current specifications are to be implemented in all systems, i.e. new mandatory fields should be filled with a value.  ### Further Documents  To enable a fast and efficient connection process between the Hubject Brokering System and Partner Systems, the following online webpage contains further information:  * [*support.hubject.com*](https://support.hubject.com/hc/en-us) – Contains all relevant information regarding the onboarding process and other technical information (e.g. Dynamic Pricing 1.0 - Functional Guide for Service Implementation) * [*Release notes from OICP2.2 to OICP2.3*](https://github.com/oicp-moderator/OICP-2.3-Draft/blob/master/Realease_Notes.asciidoc)  ### OICP protocol version and service versions  Beginning with OICP 2.1, service endpoints are versioned individually and independent of the OICP version. The table below therefore gives an overview of all web services and their current version within OICP version 2.3.    |Service |Version     | |:---|:---:| |eRoamingAuthorization|2.1   |    |eRoamingChargeDetailRecord|2.2   | |eRoamingAuthenticationData|2.1   | |eRoamingReservation|1.1   |  |eRoamingEVSEData|2.3   |  |eRoamingEVSEStatus|2.1  |  |eRoamingDynamicPricing|1.0   |  |eRoamingChargingNotifications|1.1  |   ### Overview of Document Reviews    The table below provides an overview of all changes made to this document after its initial publication. The changes documented below affect descriptions provided in this document and are mostly corrections or refinements of the specification details.  |Date of Update |Chapter Updated     | Comments | |:---|:---:|:---| |15th Septmeber 2020|OICP 2.3   |   Implementation description of the new OICP 2.3    ## Communication paradigms ### REST All new services to be introduced in the future, beginning with OICP 2.2, will be only available over the REST API. This means SOAP communication cannot be used for all new services introduced with OICP version 2.2 or later. Partners that wish to use these new services will therefore need to implement RESTful APIs for the respective communication with the HBS.  All web services described below are synchronous.  All service messages exchanged between Hubject and partner systems `MUST` use UTF-8 character encoding.  ### Availability  The Hubject system is set up in a highly available environment. Please check the partner contract for details.  ### Error handling  In case that a partner system cannot be addressed by Hubject, Hubject will monitor the connection error in the service session logging.  Each system must be able to cope with possible connection error scenarios as well as with different strategies to solve inconsistencies.  In case a partner system does not respond to a request by Hubject within the internally defined period, Hubject will monitor the connection timeout in the service session logging.  General HBS related system errors that `MAY` occur during service processing will be caught. The system will then respond to the service requestor with a default _eRoamingAcknowledgement_ message.  ### Status codes Each message requires a response message in return (at least an acknowledgement).  Most service response messages contain a “StatusCode” field (e.g. eRoamingAcknowledgement). The node provides a standardized code and status description that can be used to return details about certain process statuses. If, for example, an _eRoamingAuthorizeStart_ request fails, the requested provider can specify why the user cannot be authorized.  Code Type contains an overview of all relevant status codes.  The different states are standardized in order to make automated status processing possible. Backend systems only have to analyze the provided status code, regardless of the functional status description.  The StatusCode node additionally contains the optional “_AdditionalInfo_” field. This field can be used to provide individual information or process details that go beyond the standardized description. In case the optional “Description” field is used, the field should contain only defined values.  ### Session handling  Some web service operations that are defined in <<02_CPO_Services_and_Operations.adoc,Services and Operations>> together form a functional business process, respectively a functional session.  __Example:__  The operations in _eRoamingAuthorization_ cover a charging session. A charging session can be started with _eRoamingAuthorizeStart_ or _eRoamingAuthorizeRemoteStart_ operations and stopped with the corresponding operations. Energy consumption data can then be sent using the _eRoamingChargeDetailRecord_ operation.  To be able to relate individual operations to the correct session, Hubject assigns a SessionID to every session after the receipt of an initial request (e.g. _eRoamingAuthorizeStart_). The SessionID is part of the operation response and `MUST` be provided with each subsequent request that belongs to the session. If a request contains a SessionID that was not created by Hubject or one that is not valid, the request receives a negative response and no further process steps are performed.  Hubject uses globally unique identifiers (GUID) for SessionID creation. Furthermore, it is possible that partner backend systems use their own session concept. Hubject supports this by offering two (optional) request parameters CPOPartnerSessionID and EMPPartnerSessionID. CPO partner systems can use the CPOPartnerSessionID parameter to send their own session IDs. Hubject will assign the CPOPartnerSessionID to the Hubject SessionID and will add the CPOPartnerSessionID to every operation response so that the CPO partner systems can relate the operations to their own session handling.  NOTE: Regarding eRoaming services, the SessionID will be the leading process identifier.   ### ProviderIDs and OperatorIDs  Most web service operations require the provision of a ProviderID (EMP) or OperatorID (CPO), depending on whether the operation is requested by EMPs or CPOs. The exact format and examples of these ID’s can be seen in Operator/ProviderID  The IDs are assigned to a specific partner role and they are cross-market unique. There are two roles: eMobility Service Provider (EMP) and Charge Point Operator (CPO). A partner can have one or both roles. If a partner has both roles, two IDs (ProviderID and OperatorID) will be assigned to the partner. Hubject can identify the role that the partner has regarding the current service session depending on which ID is provided with a service request.  ### Security  Hubject compares the given Provider- or OperatorID to the partner’s SSL client certificate information with every web service request. This helps Hubject ensures that a partner cannot request operations in the name of another partner by simply sending another partner’s ID. If Hubject detects a mismatch between ProviderID/OperatorID and the client certificate information sent with the request, Hubject will not perform the operation and will respond with the status code 017 “Unauthorized Access”.  The following process diagram describes the partner identification process. It is performed at the beginning of every web service operation, which is described in this document. Consequently, all process diagrams in the appendix are implicitly preceded by this diagram.  ![Security](images/security.png)  ### Hub Provider and Hub Operator  Partners that are registered with Hubject have the possibility to bundle sub providers (EMP) or sub operators (CPO) and to act as “hub provider” or “hub operator”. The sub partners ID’s need to be configured with Hubject before they can be used in communicating with Hubject. The following diagram shows the relationships between Hubject, hub partners, and sub partners.  ![Hub partners](images/hubpartners.png)  Hubject may receive service requests that contain sub partner information, e.g. an EvcoID containing the ProviderID of a sub partner. In such cases - when Hubject does not find the ID within the group of registered partners – Hubject will check whether the corresponding partner is bundled by a registered hub provider or hub operator. If so, the following service process will be conducted on behalf of the hub partner.  NOTE: The web service fields ProviderID and OperatorID `MUST` always provide the ID of the partner communicating directly with Hubject. In case of a hub/sub scenario the fields always provide the ID of the hub partner. Sub partner IDs will only be provided implicitly through EVCO- or EVSEIDs.  *Example:*  The following diagram shows an example scenario. A hub EMP bundles a sub EMP with the ProviderID “DE*456”. A sub EMP customer wants to charge a vehicle at a CPO’s charging station. The customer identifies themselves via an EvcoID that contains the sub EMP’s ProviderID “DE*456”. Hubject cannot identify “DE*456” within the pool of EMPs that are registered with Hubject. Consequently, Hubject checks whether “DE*456” is bundled by a registered EMP. Hubject identifies the hub EMP and continues the process on behalf of the hub EMP. This means that e.g. an online authorization request or the forwarding of a charge detail record request will be sent to the hub EMP.  In case you are operating charging stations in different countries, please make sure each EVSE is equipped with the correct country code and the corresponding Operator ID. This Operator ID has to be either a sub-operator ID or your main ID.  ![Hub partner diagram](images/hubpartnerdiagram.png)  ### Data push operations  Hubject offers different operations that allow partners to upload (push) data, e.g. upload of EVSE data by CPOs.  In order to guarantee data consistency, data push requests that address the same operation `MUST` always be processed sequentially. They `MUST` never be executed in parallel. This means that a partner system `MUST` always wait for the Hubject system’s operation response before initiating the next request.  The reason for this is that push requests, which are sent in parallel, are also processed in parallel by Hubject. Thus, different requests may overtake each other and change their sequence before Hubject stores the data. This could lead to unintended data conditions.  *Example:*  A CPO sends an EVSE full load with several hundred EVSE records. Shortly after that, the same CPO sends an EVSE full load with only one EVSE record. From the CPO’s point of view, the second request should overwrite the first, resulting in only one valid EVSE record. But probably the second (small) request will overtake the first (big) request. This results in the big request overwriting the small one and with it several hundred valid EVSE records on the Hubject system.  ### Time zones  The time needs to be delivered in the format “complete date plus hours, minutes and seconds” referring to ISO 8601:1988 (E), with a time zone offset in hours and minutes. A time zone offset of \"+hh:mm\" indicates that the date/time uses a local time zone which is \"hh\" hours and \"mm\" minutes ahead of UTC. A time zone offset of \"-hh:mm\" indicates that the date/time uses a local time zone which is \"hh\" hours and \"mm\" minutes behind UTC.  `YYYY-MM-DDThh:mm:ssTZD` *e.g. “2014-02-01T15:45:00+02:00”*  where:  | Format | Description                                            | |--------|--------------------------------------------------------| | YYYY   | four-digit-year                                        | | MM     | two-digit month (01=January, etc.)                     | | DD     | two-digit day of month (01 through 31)T, separator     | | hh     | two digits of hour (00 through 23) (am/pm NOT allowed) | | mm     | two digits of minute (00 through 59)                   | | ss     | two digits seconds (00 through 59)                     | | TZD    | time zone designator (+hh:mm or -hh:mm)                |  Messages that are sent to Hubject and that Hubject directly forwards to another partner (e.g. _eRoamingChargeDetailRecord_ from CPO to EMP) will not be changed by Hubject (including time zone specifics).  It is mandatory for CPO’s to provide date/time values including a time zone offset which refers to the charge point location due to the need for time based charging fees.  In the OICP 2.3, the HBS will store all date/time values in their original form. Also, the original Date/Time values as received and stored by the HBS will be provided in the response to requests from partner systems.  ### Calibration Law for eMobility Market:  This topic is specifically important for Partners who are operating inside Germany. Calibration Law is applicable to both CPO and EMP.  This Calibration Law simply states that Customer of EMP should be able to verify the charging sessions with the help of encrypted data generated by hardware of charging station (basically Smart Energy Meter). There are few exceptional cases where this Calibration Law is not applicable.  There are three objectives of introducing this chapter in this revision of OICP  1. As a roaming platform we should give possibility for CPOs to transfer the Calibration Law relevant data (Separate fields for various parameter) for charging session to EMPs. 2. EMPs should be able to first know if the charging station (mainly EVSEID) can generate / store / share the Calibration Law compliant data. This data can be provided as a part of POI data. This will help EMPs to create appropriate B2C pricing and logic for creating appropriate invoices. Refer EVSE Data section (provide the link) 3. Long term solution for EMPs should be to automate the pre-checking of Calibration Law relevant data for charging session. This can be easily achieved if EMP has all the Calibration Law relevant data available in Charge Detail Record as separate fields. This will eventually provide a more transparent way of transmitting the data from CPOs to EMPs. Currently with older revision of OICP, CPOs are providing this data in the form of url in Charge Detail Record as “Metering Signature” field. Refer CDR section.  ## Appendix ### Business Process Diagram eRoamingAuthorization ![Business Process Diagram eRoamingAuthorization](images/eroamingauthorization.png)  ### Business Process Diagram eRoamingAuthorization Remote ![Business Process Diagram eRoamingAuthorization Remote](images/eroamingauthorizationremote.png)  ### Business Process Diagram eRoaming Reservation ![Business Process Diagram eRoaming Reservation](images/eroamingreservation.png)  ### Business Process Diagram eRoamingAuthorization GetCDRs ![Business Process Diagram eRoamingAuthorization GetCDRs GetCDRs](images/eroaminggetcdrs.png)  ### Business Process Diagram eRoamingEVSEData ![Business Process Diagram eRoamingEVSEData](images/eroamingevsedata.png)  ### Business Process Diagram eRoamingEVSEStatus ![Business Process Diagram eRoamingEVSEStatus](images/eroamingevsestatus.png)  ### Business Process Diagram eRoaming ChargingNotification Start ![Business Process Diagram eRoaming ChargingNotification Start](images/chargingnotificationstart.png)  ### Business Process Diagram eRoaming ChargingNotification Progress ![Business Process Diagram eRoaming ChargingNotification Progress](images/chargingnotificationprogress.png)  ### Business Process Diagram eRoaming ChargingNotification End ![Business Process Diagram eRoaming ChargingNotification End](images/chargingnotificationend.png)  ### Business Process Diagram eRoaming ChargingNotification Error ![Business Process Diagram eRoaming ChargingNotification Error](images/chargingnotificationerror.png)  ## Glossary and Abbreviations Charging Station - The unit where an electric vehicle is charged. A charging station consists of one or more charging spots (EVSE).  CPO (Operator) - Charge Point Operator: Mobility partner who operates the charging infrastructure.  EMP (Provider) - Electric Mobility (emobility) Provider: Mobility partner who provides emobility services to customers.  EVCO - Electric Vehicle Contract: Contract between an EMP and a customer.  EvcoID - Electric Vehicle Contract Identifier.  EVSE - Electric Vehicle Supply Equipment: Charging spot.  EvseID - Electric Vehicle Supply Equipment Identifier.  GUI - Graphical User Interface.  GUID - Globally Unique Identifier.  Hash / Hash Code - String with a fixed length that represents a data set. The hash code is generated by applying a hash function (e.g. SHA-1 hash function) to the original data.  Hubject Brokerage System (HBS) - The Hubject B2B system is the central software component that routes or storesservice information between mobility partners.  Marketplace - The role “Marketplace” is bound to the central the administrative function of the HBS system.  Mobility partner system - A mobility partner system is the central software component of a Mobility Service Provider (EMP or CPO) and operates e.g. the charging infrastructure or the electric vehicles of the Service Provider.  Session - Web service operations can be bundled and related to a certain session by unique IDs.  SHA-1 - Secure hash algorithm: A cryptographic hash function that is used to map data values to fixed-length key values.  SOAP - Simple Object Access Protocol: A web service standard that specifies the implementation and information exchange of web services.  SSL - Secure Socket Layer:  UTF-8 - is a variable-width encoding that can represent every character in the Unicode character set  WGS 84 - World Geodetic System (1984): A standard coordinate frame which is used to represent geo coordinates used by the GPS system as reference coordinate system.  WSDL - Web Service Definition Language: Technical description of functionality that is offered by a web service.  XML - Extensible Markup Language: A technical language that defines the format and encoding of documents for data exchange. 

    The version of the OpenAPI document: 2.3.0
    Contact: support@hubject.com
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json




from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Any, ClassVar, Dict, List
from typing_extensions import Annotated
try:
    from typing import Self
except ImportError:
    from typing_extensions import Self

class PricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner(BaseModel):
    """
    The starting and end time for pricing product applicability in the specified period 
    """ # noqa: E501
    begin: Annotated[str, Field(strict=True)] = Field(description="The opening time")
    end: Annotated[str, Field(strict=True)] = Field(description="The closing time")
    __properties: ClassVar[List[str]] = ["begin", "end"]

    @field_validator('begin')
    def begin_validate_regular_expression(cls, value):
        """Validates the regular expression"""
        if not re.match(r"[0-9]{2}:[0-9]{2}", value):
            raise ValueError(r"must validate the regular expression /[0-9]{2}:[0-9]{2}/")
        return value

    @field_validator('end')
    def end_validate_regular_expression(cls, value):
        """Validates the regular expression"""
        if not re.match(r"[0-9]{2}:[0-9]{2}", value):
            raise ValueError(r"must validate the regular expression /[0-9]{2}:[0-9]{2}/")
        return value

    model_config = {
        "populate_by_name": True,
        "validate_assignment": True,
        "protected_namespaces": (),
    }


    def to_str(self) -> str:
        """Returns the string representation of the model using alias"""
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        """Returns the JSON representation of the model using alias"""
        # TODO: pydantic v2: use .model_dump_json(by_alias=True, exclude_unset=True) instead
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of PricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        _dict = self.model_dump(
            by_alias=True,
            exclude={
            },
            exclude_none=True,
        )
        return _dict

    @classmethod
    def from_dict(cls, obj: Dict) -> Self:
        """Create an instance of PricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "begin": obj.get("begin"),
            "end": obj.get("end")
        })
        return _obj


