import { A_SDK_TYPES__ContextConfigurations } from "@adaas/a-sdk-types";
import { AxiosError, AxiosResponse } from "axios";

export type A_AUTH_TYPES__AuthContext_ResponseFormatter = <T = any, M = any>(response: AxiosResponse<T>, meta?: M) => T
export type A_AUTH_TYPES__AuthContext_ErrorHandler = <M = any>(error: AxiosError, meta?: M) => any




export type A_AUTH_TYPES__ContextConfigurations = {
    /**
     * Variables for the SDK
     */
    variables: {
        enable?: boolean
        ssoLocation?: string
    } & A_SDK_TYPES__ContextConfigurations['variables']

} & A_SDK_TYPES__ContextConfigurations