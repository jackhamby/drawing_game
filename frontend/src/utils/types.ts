export interface LoginResponse {
    accessToken: string;
}



// export interface Game {
//     round: number // 0, 1, 2, 3, 4
//     messages: ChatMessage[]

//     team1Points: number
//     team2Points: number

//     gameCountDown: number // Time between rounds
//     wordToGuess: string
//     activeTeam1Drawer: number
//     activeTeam2Drawer: number

//     team1ActiveDrawingDataUrl: string // image/png;base64
//     team2ActiveDrawingDataUrl: string // image/png;base64
// }

export interface Game{
    round: Round

    roundDelay: number
    team1Points: number
    team2Points: number

    lobbyId: string
    id: string
}

export interface Round {
    team1Drawer: number
    team2Drawer: number
    messages: ChatMessage[]
    team1DataUrl: string
    team2DataUrl: string
}



export interface Lobby {
    id: string;
    name: string;
    maxPlayers: number;
    hostUserId: number;

    team1: Team;
    team2: Team;

    chatMessages: ChatMessage[]
    game: Game | undefined

}

export interface Player {
    userId: number;
    username: string;
    color: string;
}

export interface Team {
    players: Player[];
}

export interface ChatMessage {
    message: string;
    username: string;
    timestamp: string
}

export interface LobbyCreate {
    name: string;
    maxPlayers: number;
}

export enum SocketEvents {
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
