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







export interface Lobby {
    id: string;
    name: string;
    players: Player[];
    maxPlayers: number;
}

export interface Player {
    userId: number;
}



export enum ErrorCode {
    "unknown" = 0,
    "loginFailed" = 1,
}

export interface ErrorPayload {
    errorCode: number;
    message: string;
}

export interface ResponsePayload {
    data: any;
    error: ErrorPayload;
}

