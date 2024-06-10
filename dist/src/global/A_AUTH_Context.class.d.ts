import { AxiosInstance } from "axios";
import { A_AUTH_Logger } from "./A_AUTH_Logger.class";
export declare class A_AUTH_Context {
    private _token;
    private _refreshTimeout?;
    logger: A_AUTH_Logger;
    private ADAAS_API_CREDENTIALS_CLIENT_ID;
    private ADAAS_API_CREDENTIALS_CLIENT_SECRET;
    private A_AUTH_CONFIG_SDK_VALIDATION;
    private A_AUTH_CONFIG_VERBOSE;
    private A_AUTH_CONFIG_IGNORE_ERRORS;
    private baseURL;
    protected axiosInstance: AxiosInstance;
    protected credentialsPromise?: Promise<void>;
    protected authPromise?: Promise<void>;
    constructor();
    get token(): string;
    get verbose(): boolean;
    get ignoreErrors(): boolean;
    get sdkValidation(): boolean;
    setCredentials(client_id: string, client_secret: string): void;
    private loadCredentials;
    private loadConfigurationsFromFile;
    authenticate(): Promise<void>;
}
export declare const A_AUTH_ContextInstance: A_AUTH_Context;
