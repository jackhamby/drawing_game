import { Lobby, UnauthorizedAccessException, UserException, UserJwtData } from "../types";
import crypto from "crypto";
import { sendLobbyClosedEvent, sendLobbyCreateEvent, sendLobbyUpdatedEvent } from "./socket-manager";

const lobbies: Record<string, Lobby> = {

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
    const lobby  = lobbies[lobbyId];
    if (!lobby){
        throw new UserException("Lobby does not exist");
    }
    else if (getLobbyPlayerCount(lobby) >= lobby.maxPlayers){
        throw new UserException("Lobby is full")
    }

    if (lobby.team1.players.find((player) => player.userId === user.userId) ||
        lobby.team2.players.find((player) => player.userId === user.userId)){
            throw new UserException("You are already in this lobby")
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

    if (lobby.hostUserId === userId){
        return closeLobby(lobby)
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



export const closeLobby = (lobby: Lobby) => {
    // lobby.team1.players.forEach((player: Player) => {
    //     send
    // })
    console.log('closing lobby')
    sendLobbyClosedEvent(lobby)
    delete lobbies[lobby.id]
    console.log(lobbies)
    // var b =2

}



// export interface Lobby {
//     id: string;
//     name: string;
//     maxPlayers: number;
//     hostUserId: number;
//     team1: Team;
//     team2: Team;
// }

// export interface Player {
//     username: string;
//     userId: number;
//     color: string;
// }

// export interface Team {
//     players: Player[];
// }


