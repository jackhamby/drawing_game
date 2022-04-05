export interface LoginResponse {
    accessToken: string;
}





export interface Lobby {
    id: string;
    name: string;
    maxPlayers: number;

    team1: Team;
    team2: Team;
}

export interface Player {
    userId: number;
    username: string;
    color: string;
}

export interface Team {
    players: Player[];
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
