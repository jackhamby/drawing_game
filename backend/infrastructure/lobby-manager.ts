import { Lobby } from "../types";
import crypto from "crypto";

const lobbies: Record<string, Lobby> = {
    "1": {
        name: "some cool lobby",
        id: "1",
        players: [
            {
                userId: 1
            },
            {
                userId: 2
            }
        ],
        maxPlayers: 8,
    },
    "2": {
        name: "some other lobby",
        id: "2",
        players: [
            {
                userId: 1
            },
            {
                userId: 2
            }
        ],
        maxPlayers: 8,
    }, 
    "3" : {
        name: "lobby JOIN FASTTT 3v3",
        id: "3",
        players: [
            {
                userId: 1
            },
            {
                userId: 2
            }
        ],
        maxPlayers: 8,
    }
}


export const getLobbies = () => {
    return Object.keys(lobbies).map((key: string) => {
        return lobbies[key];
    })
}

export const createLobby = (lobbyData: Lobby) => {
    const id = crypto.randomBytes(16).toString("hex");
    const lobby: Lobby = {
        id,
        name: lobbyData.name,
        maxPlayers: lobbyData.maxPlayers,
        players: [],
    }
    lobbies[id] = lobby;
    return id;
}
