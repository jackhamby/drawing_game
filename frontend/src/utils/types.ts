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

