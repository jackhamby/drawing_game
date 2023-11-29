


import { getLobby } from "./lobby-manager"
import crypto from "crypto";

import { ChatMessage, Game, Lobby, UserException, UserJwtData } from "../types"
import { sendGameStartedEvent, sendRoundStartedEvent } from "./socket-manager";



const games: Record<string, Game>  = {

}

export const startGame = (user: UserJwtData, lobbyId: string) => {

    //  broadcast start game to all players in lobby
    //  validate player can start game, etc.
    // queue up broadcast for first round start

    // TODO: validation to make sure they are allowed to join that lobby
    const lobby  = getLobby(user.userId, lobbyId)
    if (!lobby){
        throw new UserException("Lobby does not exist");
    }


    // TODO: put this back
    // if (lobby.game){
    //     throw new UserException("Lobby already in game")
    // }

    // else if (getLobbyPlayerCount(lobby) !== lobby.maxPlayers){
    //     throw new UserException("Lobby is not full")
    // }

    // if (user.userId !== lobby.hostUserId){
    //     throw new UnauthorizedAccessException("You cannot start this game")
    // }

    const id = crypto.randomBytes(16).toString("hex");
    const game: Game = {
        rounds: [],
        roundDelay: 3,
        team1Points: 0,
        team2Points: 0,
        activeRound: 0,
        lobbyId: lobbyId,
        id: id,
        
    }

    for (let i = 0; i < 3; i++){
        game.rounds.push({
            word: "asshole",
            team1Drawer: lobby.team1.players[0].userId, // TODO: pick random player,
            team2Drawer: lobby.team2.players[0].userId, // TODO: pick random player
            team1DataUrl: "",
            team2DataUrl: "",
            messages: [],
        })
    }

    lobby.gameId = id
    games[id] = game

    sendGameStartedEvent(lobby, game)

    setTimeout(() => {
        sendRoundStartedEvent(lobby, game, 0)
    }, game.roundDelay * 1000)
}



const startRound = (lobby: Lobby, game: Game, round: number) => {
    sendRoundStartedEvent(lobby, game, round)

}




// Server
// Game:
    // Rounds[]
    //  - number
    //  - word   
    //  - team1_drawer
    //  - team2_drawer
    //  - messages []
    //  - team1_dataUrl
    //  - team2_dataUrl
    // round
    // roundelay
    // team_1_points
    // team_2_points
    // lobbyId

// Client
// Game:
    // Round
    //  - number
    //  - team1_drawer
    //  - team2_drawer
    //  - messages []
    //  - team1_dataUrl
    //  - team2_dataUrl
    // roundelay
    // team_1_points
    // team_2_points
    // lobbyId



// StartGame()
    //  broadcast start game to all players in lobby
    //  validate player can start game, etc.
    // queue up broadcast for first round start

// EndGame()
    // broadcast end game to all players in lobby

// StartRound(round, delay)
    // broadcast start round to all players
    // queue up broadcast end round
    // 

// EndRound(round)
    // broadast end round to all players, 
    // queue up broad cast for next start round if there, other broadcast end game
    
    



