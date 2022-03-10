export interface LoginResponse {
    accessToken: string;
}

export interface Player {
    userId: number;
}

export interface Lobby {
    id: string;
    name: string;
    players: Player[];
    maxPlayers: number;
}

export interface LobbyCreate {
    name: string;
    maxPlayers: number;
}

export enum SocketEvents {
    LOBBY_CREATED = "LOBBY_CREATED",
    LOBBY_UPDATED = "LOBBY_UPDATED"
}

export interface SocketEvent {
    event: SocketEvents;
    payload: any;
}
