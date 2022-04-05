import { Lobby, UnauthorizedAccessException, UserException, UserJwtData } from "../types";
import crypto from "crypto";
import { sendLobbyCreateEvent, sendLobbyUpdatedEvent } from "./socket-manager";

const lobbies: Record<string, Lobby> = {
    "02e4944d-928d-48dd-b7ba-9f47c240cd80": {
        name: "some cool lobby",
        id: "02e4944d-928d-48dd-b7ba-9f47c240cd80",
        maxPlayers: 8,
        hostUserId: 1,
        team1: {
            players: [
                {
                    userId: 1,
                    username: "hambone",
                    color: "orange"
                },
                {
                    userId: 2,
                    username: "james kolchalka",
                    color: "orange"
                },
                {
                    userId: 3,
                    username: "monkeyboy875",
                    color: "orange"
                },
                {
                    userId: 4,
                    username: "jim jones",
                    color: "cream"
                }
            ]
        },
        team2: {
            players: [
                {
                    userId:54,
                    username: "mike Wisowski",
                    color: "black"
                }
            ]
        }
    },
    "5f0b61cd-f4e3-4d54-be6d-418f2b91fb72": {
        name: "some other lobby",
        id: "5f0b61cd-f4e3-4d54-be6d-418f2b91fb72",
        maxPlayers: 8,
        hostUserId: 1,
        team1: {
            players: []
        },
        team2: {
            players: []
        }
    },
    "79ddb636-abe5-407f-b6d4-009cdda19acb" : {
        name: "lobby JOIN FASTTT 3v3",
        id: "79ddb636-abe5-407f-b6d4-009cdda19acb",
        maxPlayers: 8,
        hostUserId: 1,
        team1: {
            players: []
        },
        team2: {
            players: []
        }
    }
}

const getLobbyPlayerCount = (lobby: Lobby) => {
    return lobby.team1.players.length  + lobby.team2.players.length
}

export const getLobbies = () => {
    return Object.keys(lobbies).map((key: string) => {
        const lobby = lobbies[key];
        if (getLobbyPlayerCount(lobby) < lobby.maxPlayers){
            return lobby;
        }
    })
}

export const createLobby = (user: UserJwtData, lobbyData: Lobby) => {
    const id = crypto.randomBytes(16).toString("hex");
    const lobby: Lobby = {
        id,
        name: lobbyData.name,
        maxPlayers: lobbyData.maxPlayers,
        hostUserId: user.userId,
        team1: {
            players: [
                {
                    userId: user.userId,
                    username: user.username,
                    color: "blue",
                }
            ],
        },
        team2: {
            players: []
        }
    }
    lobbies[id] = lobby;
    sendLobbyCreateEvent(lobby);
    return id;
}

export const getLobby = (userId: number, lobbyId: string) => {
    const lobby  = lobbies[lobbyId]
    if (!lobby){
        throw new UserException("Lobby does not exist");
    }

    const playerInTeam1 = lobby.team1.players.find((player) => {
        return player.userId === userId;
    })

    const playerInTeam2 = lobby.team2.players.find((player) => {
        return player.userId === userId;
    })

    if (!playerInTeam1 && !playerInTeam2){
        throw new UnauthorizedAccessException("You can't access this resource")
    }

    return lobby
}

export const joinLobby = (user: UserJwtData, lobbyId: string) => {
    // TODO: validation to make sure they are allowed to join that lobby
    // TODO: make sure lobby exists before we allow them to join
    // TODO: make sure no duplicate players
    const lobby  = lobbies[lobbyId];
    if (!lobby){
        throw new UserException("Lobby does not exist");
    }
    else if (getLobbyPlayerCount(lobby) >= lobby.maxPlayers){
        throw new UserException("Lobby is full")
    }

    // Check if team1 is full, if so put in team2
    if (lobby.team1.players.length < lobby.maxPlayers / 2){
        lobby.team1.players.push({
            color: "red",
            userId: user.userId,
            username: user.username,
        })
    } else {
        lobby.team2.players.push({
            color: "red",
            userId: user.userId,
            username: user.username,
        })
    }

    sendLobbyUpdatedEvent(lobby);
    return lobby;
}


export const leaveLobby = (userId: number, lobbyId: string) => {
    const lobby  = lobbies[lobbyId]
    if (!lobby){
        throw new UserException("Lobby does not exist");
    }

    // Just filter both who cares
    lobby.team1.players =  lobby.team1.players.filter((player) => {
        return player.userId !== userId;
    });

    lobby.team2.players =  lobby.team2.players.filter((player) => {
        return player.userId !== userId;
    });

    sendLobbyUpdatedEvent(lobby);
    return true;
}