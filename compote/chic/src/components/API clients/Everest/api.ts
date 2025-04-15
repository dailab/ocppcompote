/* tslint:disable */
/* eslint-disable */
/**
 * Everest CS Test
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof HTTPValidationError
     */
    'detail'?: Array<ValidationError>;
}
/**
 * 
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * 
     * @type {Array<ValidationErrorLocInner>}
     * @memberof ValidationError
     */
    'loc': Array<ValidationErrorLocInner>;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    'msg': string;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    'type': string;
}
/**
 * 
 * @export
 * @interface ValidationErrorLocInner
 */
export interface ValidationErrorLocInner {
}

/**
 * ContextManagementApi - axios parameter creator
 * @export
 */
export const ContextManagementApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Authorize
         * @param {string} [token] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorizeAuthorizePost: async (token?: string, connectorId?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/authorize`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (token !== undefined) {
                localVarQueryParameter['token'] = token;
            }

            if (connectorId !== undefined) {
                localVarQueryParameter['connector_id'] = connectorId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get Connector State
         * @param {string} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getConnectorStateConnectorStateIdGet: async (connectorId?: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/connector_state/{id}`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (connectorId !== undefined) {
                localVarQueryParameter['connector_id'] = connectorId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Show Context
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        showContextContextGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/context`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Startcharging
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        startchargingStartchargingPost: async (commands?: string, connectorId?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/startcharging`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (commands !== undefined) {
                localVarQueryParameter['commands'] = commands;
            }

            if (connectorId !== undefined) {
                localVarQueryParameter['connector_id'] = connectorId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Startchargingiso15118
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        startchargingiso15118Startchargingiso15118Post: async (commands?: string, connectorId?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/startchargingiso15118`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (commands !== undefined) {
                localVarQueryParameter['commands'] = commands;
            }

            if (connectorId !== undefined) {
                localVarQueryParameter['connector_id'] = connectorId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Unplug
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        unplugUnplugPost: async (commands?: string, connectorId?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/unplug`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (commands !== undefined) {
                localVarQueryParameter['commands'] = commands;
            }

            if (connectorId !== undefined) {
                localVarQueryParameter['connector_id'] = connectorId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Update Context
         * @param {string} key 
         * @param {string} value 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateContextUpdateContextPost: async (key: string, value: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'key' is not null or undefined
            assertParamExists('updateContextUpdateContextPost', 'key', key)
            // verify required parameter 'value' is not null or undefined
            assertParamExists('updateContextUpdateContextPost', 'value', value)
            const localVarPath = `/update-context`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (key !== undefined) {
                localVarQueryParameter['key'] = key;
            }

            if (value !== undefined) {
                localVarQueryParameter['value'] = value;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ContextManagementApi - functional programming interface
 * @export
 */
export const ContextManagementApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ContextManagementApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Authorize
         * @param {string} [token] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authorizeAuthorizePost(token?: string, connectorId?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authorizeAuthorizePost(token, connectorId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.authorizeAuthorizePost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get Connector State
         * @param {string} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getConnectorStateConnectorStateIdGet(connectorId?: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getConnectorStateConnectorStateIdGet(connectorId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.getConnectorStateConnectorStateIdGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Show Context
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async showContextContextGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.showContextContextGet(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.showContextContextGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Startcharging
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async startchargingStartchargingPost(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.startchargingStartchargingPost(commands, connectorId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.startchargingStartchargingPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Startchargingiso15118
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async startchargingiso15118Startchargingiso15118Post(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.startchargingiso15118Startchargingiso15118Post(commands, connectorId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.startchargingiso15118Startchargingiso15118Post']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Unplug
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async unplugUnplugPost(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.unplugUnplugPost(commands, connectorId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.unplugUnplugPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Update Context
         * @param {string} key 
         * @param {string} value 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateContextUpdateContextPost(key: string, value: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateContextUpdateContextPost(key, value, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ContextManagementApi.updateContextUpdateContextPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * ContextManagementApi - factory interface
 * @export
 */
export const ContextManagementApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ContextManagementApiFp(configuration)
    return {
        /**
         * 
         * @summary Authorize
         * @param {string} [token] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorizeAuthorizePost(token?: string, connectorId?: number, options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.authorizeAuthorizePost(token, connectorId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get Connector State
         * @param {string} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getConnectorStateConnectorStateIdGet(connectorId?: string, options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.getConnectorStateConnectorStateIdGet(connectorId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Show Context
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        showContextContextGet(options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.showContextContextGet(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Startcharging
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        startchargingStartchargingPost(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.startchargingStartchargingPost(commands, connectorId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Startchargingiso15118
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        startchargingiso15118Startchargingiso15118Post(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.startchargingiso15118Startchargingiso15118Post(commands, connectorId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Unplug
         * @param {string} [commands] 
         * @param {number} [connectorId] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        unplugUnplugPost(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.unplugUnplugPost(commands, connectorId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update Context
         * @param {string} key 
         * @param {string} value 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateContextUpdateContextPost(key: string, value: string, options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.updateContextUpdateContextPost(key, value, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ContextManagementApi - object-oriented interface
 * @export
 * @class ContextManagementApi
 * @extends {BaseAPI}
 */
export class ContextManagementApi extends BaseAPI {
    /**
     * 
     * @summary Authorize
     * @param {string} [token] 
     * @param {number} [connectorId] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public authorizeAuthorizePost(token?: string, connectorId?: number, options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).authorizeAuthorizePost(token, connectorId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get Connector State
     * @param {string} [connectorId] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public getConnectorStateConnectorStateIdGet(connectorId?: string, options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).getConnectorStateConnectorStateIdGet(connectorId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Show Context
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public showContextContextGet(options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).showContextContextGet(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Startcharging
     * @param {string} [commands] 
     * @param {number} [connectorId] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public startchargingStartchargingPost(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).startchargingStartchargingPost(commands, connectorId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Startchargingiso15118
     * @param {string} [commands] 
     * @param {number} [connectorId] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public startchargingiso15118Startchargingiso15118Post(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).startchargingiso15118Startchargingiso15118Post(commands, connectorId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Unplug
     * @param {string} [commands] 
     * @param {number} [connectorId] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public unplugUnplugPost(commands?: string, connectorId?: number, options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).unplugUnplugPost(commands, connectorId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Update Context
     * @param {string} key 
     * @param {string} value 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContextManagementApi
     */
    public updateContextUpdateContextPost(key: string, value: string, options?: RawAxiosRequestConfig) {
        return ContextManagementApiFp(this.configuration).updateContextUpdateContextPost(key, value, options).then((request) => request(this.axios, this.basePath));
    }
}



