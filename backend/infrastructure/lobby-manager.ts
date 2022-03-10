import { Lobby, UserException } from "../types";
import crypto from "crypto";
import { sendLobbyCreateEvent, sendLobbyUpdatedEvent } from "./socket-manager";

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
        if (lobbies[key]?.players?.length < lobbies[key].maxPlayers){
            return lobbies[key];
        }
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
    sendLobbyCreateEvent(lobby);
    return id;
}

export const joinLobby = (userId: number, lobbyId: string) => {
    // TODO: validation to make sure they are allowed to join that lobby
    // TODO: make sure lobby exists before we allow them to join
    // TODO: make sure no duplicate players
    const lobby  = lobbies[lobbyId]
    if (!lobby){
        throw new UserException("Lobby does not exist");
    }
    else if (lobby.players?.length >= lobby.maxPlayers){
        throw new UserException("Lobby is full")
    }

    lobbies[lobbyId].players.push({
        userId
    });

    sendLobbyUpdatedEvent(lobbies[lobbyId]);
    return true;
}
