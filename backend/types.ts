export interface CreateUser {
    username: string;
    password: string;
}

export interface Login {
    username: string;
    password: string;
}

export interface User {
    user_id: number;
    username: string;
    password: string;
    salt: string;
    iterations: number;
}

export interface LoginResponse {
    accessToken: string;
}




export enum ErrorCode {
    "unknown" = 0,
}

export interface ErrorPayload {
    errorCode: number;
    message: string;
}

export interface ResponsePayload {
    data: any;
    error: ErrorPayload;
}

