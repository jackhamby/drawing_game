import { ChatMessage, Lobby, UnauthorizedAccessException, UserException, UserJwtData } from "../types";
import crypto from "crypto";
import { sendGameStartedEvent, sendLobbyChatMessageEvent, sendLobbyClosedEvent, sendLobbyCreateEvent, sendLobbyUpdatedEvent, sendRoundStartedEvent } from "./socket-manager";

const lobbies: Record<string, Lobby> = {

    // "test": {
    //     id: "test",
    //     name: "test",
    //     maxPlayers: 24,
    //     hostUserId: 1,
    //     team1: {
    //         players: [
    //             {
    //                 username: "test11",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test12",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test13",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test14",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test15",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test16",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test17",
    //                 userId: 123,
    //                 color:"pink"
    //             }
    //         ]
    //     },
    //     team2: {
    //         players: [
    //             {
    //                 username: "test21",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test22",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test23",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test24",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test25",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test26",
    //                 userId: 123,
    //                 color:"pink"
    //             },
    //             {
    //                 username: "test27",
    //                 userId: 123,
    //                 color:"pink"
    //             }
    //         ]
    //     },
    //     chatMessages: []
    // },

    "test": {
        id: "test",
        name: "test",
        maxPlayers: 4,
        hostUserId: 1,
        team1: {
            players: [
                // {
                //     username: "test11",
                //     userId: 123,
                //     color:"pink"
                // },
            ]
        },
        team2: {
            players: [
                {
                    username: "test21",
                    userId: 123,
                    color:"pink"
                },
                {
                    username: "test22",
                    userId: 123,
                    color:"pink"
                },
            ]
        },
        chatMessages: [],
        gameId: undefined
    }



}


const getLobbyPlayerCount = (lobby: Lobby) => {
    return lobby.team1.players.length  + lobby.team2.players.length
}

// TODO: add filters like is_full, etc.
export const getLobbies = () => {
    return Object.keys(lobbies).filter(key => {
        const lobby = lobbies[key];
        if (getLobbyPlayerCount(lobby) < lobby.maxPlayers){
            return true
        }
        return false
    }).map(key => {
        return lobbies[key]
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
        },
        chatMessages: [],
        gameId: undefined
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
    console.log("getting lobby")
    console.log(lobby)
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

// export const startLobby = (user: UserJwtData, lobbyId: string) => {
//         // TODO: validation to make sure they are allowed to join that lobby
//         const lobby  = lobbies[lobbyId];
//         if (!lobby){
//             throw new UserException("Lobby does not exist");
//         }


//         // TODO: put this back
//         // if (lobby.game){
//         //     throw new UserException("Lobby already in game")
//         // }

//         // else if (getLobbyPlayerCount(lobby) !== lobby.maxPlayers){
//         //     throw new UserException("Lobby is not full")
//         // }

//         // if (user.userId !== lobby.hostUserId){
//         //     throw new UnauthorizedAccessException("You cannot start this game")
//         // }

//         const game: Game  = {
//             round: 0,
//             messages: [],

//             team1Points: 0,
//             team2Points: 0,
//             gameCountDown: 3,
//             wordToGuess: "ass", // TODO: implement random owrd,
//             activeTeam1Drawer: lobby.team1.players[0].userId, // TODO: pick random player
//             activeTeam2Drawer: lobby.team2.players[0].userId, // TODO: pick random player
//             team1ActiveDrawingDataUrl: "",
//             team2ActiveDrawingDataUrl: "",
//         }

//         lobby.game = game

//         sendGameStartedEvent(lobby)

//         setTimeout(() => {
//             sendRoundStartedEvent(lobby, 0)
//         }, game.gameCountDown * 1000)
// }

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


export const messageLobby = (userId: number, lobbyId: string, message: string, username: string) => {
    const lobby = getLobby(userId, lobbyId)
    const chatMessage: ChatMessage = {
        username,
        message,
        timestamp: new Date().toUTCString(),
    }
    lobby.chatMessages.push(chatMessage)
    sendLobbyChatMessageEvent(lobby)
    return true
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


