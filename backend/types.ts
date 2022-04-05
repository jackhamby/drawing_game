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

export interface UserJwtData {
    username: string;
    userId: number;
}






export interface Lobby {
    id: string;
    name: string;
    maxPlayers: number;
    hostUserId: number;
    team1: Team;
    team2: Team;
}

export interface Player {
    username: string;
    userId: number;
    color: string;
}

export interface Team {
    players: Player[];
}






export class UserException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserException";
      }
}

export class UnauthorizedAccessException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedAccessException";
      }
}

export interface ErrorPayload {
    message: string;
}

export interface ResponsePayload {
    data: any;
    error: ErrorPayload;
}

