import ws from "ws";



// export interface Game {
//     round: number // 0, 1, 2, 3, 4
//     messages: ChatMessage[]

//     team1Points: number
//     team2Points: number

//     gameCountDown: number // 0 means round active
//     wordToGuess: string
//     activeTeam1Drawer: number
//     activeTeam2Drawer: number

//     team1ActiveDrawingDataUrl: string // image/png;base64
//     team2ActiveDrawingDataUrl: string // image/png;base64
// }


export interface Game{
    rounds: Round[]
    activeRound: number

    roundDelay: number
    team1Points: number
    team2Points: number

    lobbyId: string
    id: string
}

export interface Round {
    word: string
    team1Drawer: number
    team2Drawer: number
    messages: ChatMessage[]
    team1DataUrl: string
    team2DataUrl: string
}




export interface SocketConnection {
    authToken: string;
    userId: number;
    socket: ws.WebSocket;
    lobbyId: string | null
}


export enum SocketEvents {
    CONNECTION = "CONNECTION",

    LOBBY_CREATED = "LOBBY_CREATED",
    LOBBY_UPDATED = "LOBBY_UPDATED",
    LOBBY_CLOSED = "LOBBY_CLOSED",
    LOBBY_CHAT_MESSAGE = "LOBBY_CHAT_MESSAGE",

    GAME_STARTED = "GAME_STARTED",
    GAME_ENDED = "GAME_ENDED",
    ROUND_STARTED = "ROUND_STARTED",
    ROUND_ENDED = "ROUND_ENDED",
    GAME_UPDATED = "GAME_UPDATED"
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




export interface ChatMessage {
    message: string;
    username: string;
    timestamp: string
}


export interface Lobby {
    id: string;
    name: string;
    maxPlayers: number;
    hostUserId: number;
    team1: Team;
    team2: Team;
    chatMessages: ChatMessage[]
    gameId: string | undefined
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

