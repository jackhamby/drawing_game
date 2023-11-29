import { axiosClient } from "..";
import { AxiosError, AxiosResponse } from "axios"

export interface Response<T> {
    data: T,
    error: {
        message: string
    }
}

export const get = async <T>(url: string, params: Record<string, any> = {}): Promise<Response<T>> => {
    let response: AxiosResponse<Response<T>>;
    try {
        response = await axiosClient.get<Response<T>>(url, { params });
    }
    catch(error: any) {
        console.error(`GET request faied to ${url}`);
        console.error(error)
        response = error?.response;
    }

    return response?.data;
}

export const post = async <T>(url: string, data: any): Promise<Response<T>> => {
    let response: AxiosResponse<Response<T>>;
    try {
        response = await axiosClient.post<Response<T>>(url, data);
    }
    catch(error: any) {
        console.error(`POST request faied to ${url}`);
        console.error(error)
        response = error?.response;
    }

    return response?.data;
}