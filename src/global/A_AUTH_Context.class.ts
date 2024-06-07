import axios, { AxiosInstance, AxiosResponse } from "axios";
import fs from 'fs';
import { A_AUTH_Logger } from "./A_AUTH_Logger.class";
import { A_AUTH_Error } from "./A_AUTH_Error.class";
import { A_AUTH_ERRORS } from "../constants/errors.constants";

export class A_AUTH_Context {

    private _token: string = '';
    private logger: A_AUTH_Logger

    // Credentials for ADAAS SSO via API
    private ADAAS_API_CREDENTIALS_CLIENT_ID: string = '';
    private ADAAS_API_CREDENTIALS_CLIENT_SECRET: string = '';

    // Configuration
    private A_AUTH_CONFIG_SDK_VALIDATION: boolean = true
    private A_AUTH_CONFIG_VERBOSE: boolean = true
    private A_AUTH_CONFIG_IGNORE_ERRORS: boolean = false

    private baseURL = process.env.ADAAS_SSO_LOCATION || 'https://sso.adaas.org';
    protected axiosInstance: AxiosInstance

    protected credentialsPromise: Promise<void> | null = null;

    constructor() {

        this.logger = new A_AUTH_Logger(this.verbose, this.ignoreErrors);

        this.axiosInstance = axios.create({
            baseURL: this.baseURL
        });

        this.axiosInstance.interceptors.request.use(async (conf) => {
            if (this._token)
                conf.headers.Authorization = `Bearer ${this.token}`;

            return conf;
        });

        this.axiosInstance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            const err = new A_AUTH_Error(error);
            this.logger.error(err);
            throw err
        });

        // global logger configuration

        // process.on('uncaughtException', (error) => {
        //     // log only in case of A_AUTH_Error
        //     if (error instanceof A_AUTH_Error)
        //         this.logger.error(error);
        // });
    }


    get token(): string {
        return this._token;
    }

    get verbose(): boolean {
        return process.env.A_AUTH_CONFIG_VERBOSE === 'true' || this.A_AUTH_CONFIG_VERBOSE;
    }

    get ignoreErrors(): boolean {
        return process.env.A_AUTH_CONFIG_IGNORE_ERRORS === 'true' || this.A_AUTH_CONFIG_IGNORE_ERRORS;
    }

    get sdkValidation(): boolean {
        return process.env.A_AUTH_CONFIG_SDK_VALIDATION === 'true' || this.A_AUTH_CONFIG_SDK_VALIDATION;
    }


    setCredentials(client_id: string, client_secret: string) {
        this.ADAAS_API_CREDENTIALS_CLIENT_ID = client_id;
        this.ADAAS_API_CREDENTIALS_CLIENT_SECRET = client_secret;
        this.logger.log('Credentials set manually');
    }

    private loadCredentials(): Promise<void> {
        if (!this.credentialsPromise)
            this.credentialsPromise = new Promise((resolve, reject) => {
                switch (true) {
                    case !!this.ADAAS_API_CREDENTIALS_CLIENT_ID && !!this.ADAAS_API_CREDENTIALS_CLIENT_SECRET:
                        break;

                    case fs.existsSync('adaas.conf.json'):
                        this.loadConfigurationsFromFile();
                        break;

                    case !!process.env.ADAAS_API_CREDENTIALS_CLIENT_ID && !!process.env.ADAAS_API_CREDENTIALS_CLIENT_SECRET:

                        this.ADAAS_API_CREDENTIALS_CLIENT_ID = process.env.ADAAS_API_CREDENTIALS_CLIENT_ID;
                        this.ADAAS_API_CREDENTIALS_CLIENT_SECRET = process.env.ADAAS_API_CREDENTIALS_CLIENT_SECRET;

                        this.logger.log('Credentials loaded from environment variables');
                        break;

                    default:
                        reject(new A_AUTH_Error(A_AUTH_ERRORS.CREDENTIALS_NOT_FOUND));
                }

                this.logger = new A_AUTH_Logger(this.verbose, this.ignoreErrors);
                resolve();
            });

        return this.credentialsPromise;
    }



    private loadConfigurationsFromFile() {
        try {
            const data = fs.readFileSync('adaas.conf.json', 'utf8');

            const config = JSON.parse(data);

            if (!config.client_id || !config.client_secret)
                throw new A_AUTH_Error(A_AUTH_ERRORS.CREDENTIALS_NOT_FOUND);

            this.ADAAS_API_CREDENTIALS_CLIENT_ID = config.client_id;
            this.ADAAS_API_CREDENTIALS_CLIENT_SECRET = config.client_secret;
            this.A_AUTH_CONFIG_VERBOSE = config.verbose || this.A_AUTH_CONFIG_VERBOSE;
            this.A_AUTH_CONFIG_IGNORE_ERRORS = config.ignoreErrors || this.A_AUTH_CONFIG_IGNORE_ERRORS;
            this.A_AUTH_CONFIG_SDK_VALIDATION = config.sdkValidation || this.A_AUTH_CONFIG_SDK_VALIDATION;

            this.logger.log('Credentials loaded from file');
        } catch (error) {
            this.logger.error(error);
        }
    }


    async authenticate() {
        if (this._token) return;

        await this.loadCredentials();

        const response: AxiosResponse<{ token: string }> = await this.axiosInstance.post(
            `${this.baseURL}/api/v1/auth/api-credentials/authorize`,
            {
                client_id: this.ADAAS_API_CREDENTIALS_CLIENT_ID,
                client_secret: this.ADAAS_API_CREDENTIALS_CLIENT_SECRET
            });

        this._token = response.data.token;
    }
}


export const A_AUTH_ContextInstance = new A_AUTH_Context();
