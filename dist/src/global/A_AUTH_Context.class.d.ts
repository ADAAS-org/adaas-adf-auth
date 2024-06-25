import { A_SDK_Context } from "@adaas/a-sdk-types";
import { A_AUTH_TYPES__IAuthenticator } from "../types/A_AUTH_Authenticator.types";
import { A_AUTH_TYPES__AuthContext_ErrorHandler, A_AUTH_TYPES__AuthContext_ResponseFormatter } from "../types/A_AUTH_Context.types";
export declare class A_AUTH_ContextClass extends A_SDK_Context {
    /**
     * API Credentials Authentication using CLIENT_ID and CLIENT_SECRET
     * Uses Across all SDKs connected to A-AUTH
     */
    global: A_SDK_Context;
    protected SSO_LOCATION: string;
    responseFormatter: A_AUTH_TYPES__AuthContext_ResponseFormatter;
    errorsHandler: A_AUTH_TYPES__AuthContext_ErrorHandler;
    protected customAllowedProperties: readonly ["CONFIG_SDK_VALIDATION", "CONFIG_VERBOSE", "CONFIG_IGNORE_ERRORS", "CONFIG_FRONTEND", "SSO_LOCATION"];
    protected _AuthMap: Map<string, A_AUTH_TYPES__IAuthenticator>;
    constructor();
    getConfigurationProperty<T = any>(property: typeof this.customAllowedProperties[number]): T | undefined;
    /**
     * Allows to define a global custom API response and error processors
     *
     * @param responseFormatter
     * @param errorsHandler
     */
    setAPIHandlers(responseFormatter: A_AUTH_TYPES__AuthContext_ResponseFormatter, errorsHandler: A_AUTH_TYPES__AuthContext_ErrorHandler): void;
    /**
     *
     * Returns a authentication depending on the request type
     *
     * @param userASEID
     * @returns
     */
    getAuthenticator(userASEID?: string): A_AUTH_TYPES__IAuthenticator;
    protected loadExtendedConfigurationsFromEnvironment(): Promise<void>;
    protected loadExtendedConfigurationsFromFile<T = any>(config: T): Promise<void>;
}
export declare const A_AUTH_Context: A_AUTH_ContextClass;
