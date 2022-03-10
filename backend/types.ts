import ws from "ws";


export interface SocketConnection {
    authToken: string;
    userId: number;
    gameId?: number;
    socket: ws.WebSocket;
}


export enum SocketEvents {
    LOBBY_CREATED = "LOBBY_CREATED",
    LOBBY_UPDATED = "LOBBY_UPDATED"
}

export interface SocketEvent {
    event: SocketEvents;
    payload: any;
}


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






export class UserException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserException";
      }
}

export interface ErrorPayload {
    message: string;
}

export interface ResponsePayload {
    data: any;
    error: ErrorPayload;
}

