import { A_AUTH_AppInteractions_APIProvider } from "@adaas/a-auth/global/api-providers/A_AUTH_AppInteractions.api";
import {
    A_AUTH_APP_INTERACTIONS_TYPES__RefreshTokenRequest,
    A_AUTH_APP_INTERACTIONS_TYPES__RefreshTokenResponse,
    A_AUTH_APP_INTERACTIONS_TYPES__VerifyTokenRequest,
    A_AUTH_APP_INTERACTIONS_TYPES__VerifyTokenResponse
} from "./A_AUTH_Token.types";


export class A_AUTH_APP_INTERACTIONS__TokenAPI extends A_AUTH_AppInteractions_APIProvider {

    protected baseURL = this.context.getConfigurationProperty('SSO_LOCATION');


    /**
     * 
     * Method to validate token
     * 
     * @param request 
     * @param meta 
     * @returns 
     */
    async verifyToken<M = any>(
        request: A_AUTH_APP_INTERACTIONS_TYPES__VerifyTokenRequest,
        /**
         * The meta object to pass through API call for error handling or response handling
         */
        meta?: M
    ) {
        return await this.post<A_AUTH_APP_INTERACTIONS_TYPES__VerifyTokenResponse, M>(
            `/auth/token/verify`,
            request,
            {
                meta
            });
    }



    /**
     * 
     * Method to refresh token 
     * 
     * @param request 
     * @param meta 
     * @returns 
     */
    async refreshToken<M = any>(
        request: A_AUTH_APP_INTERACTIONS_TYPES__RefreshTokenRequest,
        /**
         * The meta object to pass through API call for error handling or response handling
         */
        meta?: M
    ) {
        return await this.post<A_AUTH_APP_INTERACTIONS_TYPES__RefreshTokenResponse, M>(
            `/auth/token/refresh`,
            request,
            {
                meta
            });
    }


    // async validateInvite(invite) {
    //     this.loading = true

    //     return await this.__axiosInstance.post(`/auth/invite/verify`, {
    //         invite
    //     });

    // }

}
