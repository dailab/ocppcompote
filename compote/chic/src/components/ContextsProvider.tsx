"use client";

import { CSMSContext, EMPMSContext } from "@/types";
import { defaultSWRConfig, fetcher, fetcher2 } from "@/utils";
import React, { useContext } from "react";
import useSWR, { SWRResponse } from "swr";

const csmsContextsContext = React.createContext<{
  [index: string]: CSMSContext;
} | null>(null);
const empmsContextContext = React.createContext<EMPMSContext | null>(null);
const onlineServicesContext = React.createContext<string[]>([]);

export const useCsmsContexts = () => {
  return useContext(csmsContextsContext);
};
export const useEmpmsContext = () => {
  return useContext(empmsContextContext);
};
export const useOnlineServices = () => {
  return useContext(onlineServicesContext);
};

export function ContextsProvider({ children }: { children: React.ReactNode }) {
  // API Calls
  const {
    data: csmsContexts,
    isLoading: _isLoadingCsmsContexts,
    error: loadingCsmsContextsError,
  }: SWRResponse<{ [index: string]: CSMSContext }> = useSWR(
    `${process.env.NEXT_PUBLIC_CSMS_OCPP}/context`,
    fetcher,
    {
      ...defaultSWRConfig,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateIfStale: true,
    }
  );
  const {
    data: empmsContext,
    isLoading: _isLoadingEmpmsContext,
    error: loadingEmpmsContextError,
  }: SWRResponse<EMPMSContext> = useSWR(
    `${process.env.NEXT_PUBLIC_EMP_TEST_TOOLKIT}/context`,
    fetcher,
    {
      ...defaultSWRConfig,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateIfStale: true,
    }
  );
  const {
    data: traces,
    isLoading: _isLoadingTraces,
    error: _loadingTracesError,
  }: SWRResponse<{ [index: string]: any }[][]> = useSWR(
    `${process.env.NEXT_PUBLIC_ZIPKIN}/api/v2/traces?lookback=86400000&limit=5000`,
    fetcher,
    {
      ...defaultSWRConfig,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateIfStale: true,
    }
  );
  const { error: loadingERoamingError } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_EROAMING_OICP}/docs`,
    fetcher2,
    {
      ...defaultSWRConfig,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateIfStale: true,
    }
  );
  const { error: loadingCsEverestMqttError } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_CS_EVEREST_MQTT}/docs`,
    fetcher2,
    {
      ...defaultSWRConfig,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateIfStale: true,
    }
  );

  return (
    <csmsContextsContext.Provider value={csmsContexts || null}>
      <empmsContextContext.Provider value={empmsContext || null}>
        <onlineServicesContext.Provider
          value={[
            ...(loadingCsmsContextsError ? [] : ["csms"]),
            ...(loadingEmpmsContextError ? [] : ["empms"]),
            ...(loadingERoamingError ? [] : ["eroaming"]),
            ...(loadingCsEverestMqttError ? [] : ["cseverest"]),
            ...(traces
              ? Array.from(
                  new Set([
                    ...traces
                      .flat()
                      .filter(
                        (t) =>
                          "localEndpoint" in t &&
                          typeof t.localEndpoint === "object" &&
                          t.localEndpoint !== null &&
                          "serviceName" in t.localEndpoint
                      )
                      .filter((t) => {
                        if (
                          ["csms", "empms", "eroaming", "cseverest"].includes(
                            t.localEndpoint.serviceName
                          )
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((t) => t.localEndpoint.serviceName),
                    "zipkin",
                  ])
                )
              : []),
          ]}
        >
          {children}
        </onlineServicesContext.Provider>
      </empmsContextContext.Provider>
    </csmsContextsContext.Provider>
  );
}
