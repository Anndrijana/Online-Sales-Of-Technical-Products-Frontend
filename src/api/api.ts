import axios, { AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";

export default function api(path: string, method: 'get' | 'put' | 'post' | 'patch' | 'delete', body: undefined | any,  role: 'customer' | 'administrator' = 'customer',
) {
    return new Promise<ApiResponse>((resolve, reject) => {
        axios({
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            }
        })
        .then(res => responseHandler(res, resolve as any))
        .catch(err => reject(err));
    });
}

export interface ApiResponse {
    status: 'ok' | 'error' | 'login';
    data: any;
}

function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value?: ApiResponse) => void,
) {
    if (res.status < 200 || res.status >= 300) {
        const response: ApiResponse = {
            status: 'error',
            data: res.data,
        };

        return resolve(response);
    }

    const response: ApiResponse = {
        status: 'ok',
        data: res.data,
    };

    return resolve(response);
}

function getToken(): string {
    const token = localStorage.getItem('api_token');
    return token as any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function saveToken(token: string) {
    localStorage.setItem('api_token', token);
}
