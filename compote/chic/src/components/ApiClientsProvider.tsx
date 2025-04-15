"use client";

import React, { useContext } from "react";
import {
  EMPOICPClientAPIApi,
  Configuration as EMPMSConfiguration,
} from "./API clients/EMPMS";
import {
  Configuration as CSMSOCPPConfiguration,
  OCPPv16Api,
  OCPPv201Api,
} from "./API clients/CSMS";
import {
  Configuration as CSMSOICPConfiguration,
  CPOOICPClientAPIApi,
} from "./API clients/CSMS-OICP-API";
import {
  Configuration as EverestConfiguration,
  ContextManagementApi,
} from "./API clients/Everest";

const apiClientsContext = React.createContext<{
  empmsClientApi: EMPOICPClientAPIApi | null;
  csmsOcppV16Api: OCPPv16Api | null;
  csmsOcppV201Api: OCPPv201Api | null;
  csmsOicpApi: CPOOICPClientAPIApi | null;
  everestMqttApi: ContextManagementApi | null;
}>({
  empmsClientApi: null,
  csmsOcppV16Api: null,
  csmsOcppV201Api: null,
  csmsOicpApi: null,
  everestMqttApi: null,
});

export const useApiClients = () => {
  return useContext(apiClientsContext);
};

export function ApiClientsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // EMP->eRoaming
  const empmsClientApiConfig = new EMPMSConfiguration({
    basePath: process.env.NEXT_PUBLIC_EMPMS_OICP,
  });
  const empmsClientApi = new EMPOICPClientAPIApi(empmsClientApiConfig);

  // CPO->CS
  const csmsOcppV16ApiConfig = new CSMSOCPPConfiguration({
    basePath: process.env.NEXT_PUBLIC_CSMS_OCPP,
  });
  const csmsOcppV16Api = new OCPPv16Api(csmsOcppV16ApiConfig);
  const csmsOcppV201ApiConfig = new CSMSOCPPConfiguration({
    basePath: process.env.NEXT_PUBLIC_CSMS_OCPP,
  });
  const csmsOcppV201Api = new OCPPv201Api(csmsOcppV201ApiConfig);

  // CPO->eRoaming
  const csmsOicpApiConfig = new CSMSOICPConfiguration({
    basePath: process.env.NEXT_PUBLIC_CSMS_OICP,
  });
  const csmsOicpApi = new CPOOICPClientAPIApi(csmsOicpApiConfig);

  // Everest->CS
  const everestMqttConfig = new EverestConfiguration({
    basePath: process.env.NEXT_PUBLIC_CS_EVEREST_MQTT,
  });
  const everestMqttApi = new ContextManagementApi(everestMqttConfig);

  return (
    <apiClientsContext.Provider
      value={{
        empmsClientApi,
        csmsOcppV16Api,
        csmsOcppV201Api,
        csmsOicpApi,
        everestMqttApi,
      }}
    >
      {children}
    </apiClientsContext.Provider>
  );
}
