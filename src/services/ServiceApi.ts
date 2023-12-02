import { store } from "..";
import { logoutAction } from "../reducer/Authentication";
import PromiseQueue from "../utils/PromiseQueue";
import AuthService from "./AuthService";
import { PermissionError, UnauthorizedError } from "./Errors";
import Settings from "./Settings";

export interface FetchOptions {
    method?: string,
    body?: BodyInit,
    headers?: { [key: string]: string }
}

export function getRequestHeader(access_token: string | null, useAuthentication: boolean = true): Record<string, string> {
    var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (useAuthentication) {
        header = Object.assign(header, { 'Authorization': `Bearer ${access_token}` });
    }

    return header;
}

export function getBaseUrl(model: string) {
    const { apiProtocol, apiHost, apiPort, apiPath } = Settings.get();
    return `${apiProtocol}://${apiHost}:${apiPort}${apiPath}/${model}/`;
}

const queue: PromiseQueue<any, any> = new PromiseQueue<any, any>();
type METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export async function promiseRequest(url: string, method?: METHOD, body?: Object, throwError?: boolean, useAuthentication: boolean = true) {

    return await queue.enqueueAsync(null, async () => {
        try {
            var access_token = AuthService.instance.getAccessToken();

            // if (!access_token && useAuthentication) {
            //     throw new Error(`Não autorizado ${url}`);
            // }
            var options: FetchOptions = {
                method: method || 'GET',
                headers: getRequestHeader(access_token, useAuthentication)
            }
            if (body) {
                options.body = typeof body === 'string' ? body : JSON.stringify(body)
            }

            var response = await fetch(url, options);

            if (response.status === 401) {
                    console.error("Não autorizado");
            }

            if (response.status === 204) {
                return true;
            }

            const text = await response.text();

            if (response.ok) {
                try {
                    return (typeof text === 'string' ? JSON.parse(text) : null);
                } catch (e) {
                    return text;
                }
            } else {
                if (response.status === 401) {
                    await AuthService.instance.logout();
                    store.dispatch(logoutAction());
                    throw new UnauthorizedError(text);
                }
                if (response.status === 403) {
                    const r = JSON.parse(text);
                    throw new PermissionError(r && r.message);
                }
                throw new Error(text);
            }
        } catch (e) {
            console.log('Request Error', e);
            if (throwError) {
                throw e;
            } else {
                return null;
            }
        }
    });
}

export async function promiseGetRequest(url: string, useAuthentication?: boolean) {
    return promiseRequest(url, 'GET', undefined, undefined, useAuthentication);
}

export interface ResponseData<T> {
    status: number,
    message: string,
    data: T[]
}

export class ServiceApi<T>{

    constructor(protected model: string) {
        this.getBaseUrl = this.getBaseUrl.bind(this);
        this.getList = this.getList.bind(this);
        this.getById = this.getById.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    getBaseUrl() {
        var model = this.model;
        return getBaseUrl(model);
    }

    getList(query?: string | null, auth?:boolean): Promise<ResponseData<T>> {
        var baseUrl = this.getBaseUrl();
        var url = baseUrl + 'find/all';
        if (query) {
            url += `?${query}`;
        }
        return promiseGetRequest(url, auth);
    }

    getById(id: number | string): Promise<T> {
        var baseUrl = this.getBaseUrl();
        var url = baseUrl + `find/id/${id}`;
        return promiseGetRequest(url);
    }

    async update(id: number | string, item: Partial<T>): Promise<boolean> {
        var baseUrl = this.getBaseUrl();
        var url = baseUrl + `update/${id}`;
        var result = await promiseRequest(url, 'PATCH', item);
        return result !== null;
    }

    insert(item: Partial<T>, throwError?: boolean): Promise<T> {
        var baseUrl = this.getBaseUrl();
        var url = baseUrl + 'create';
        return promiseRequest(url, 'POST', item, throwError);
    }

    delete(id: number | string) {
        var baseUrl = this.getBaseUrl();
        var url = baseUrl + `delete/id/${id}`;
        return promiseRequest(url, 'DELETE');
    }
}