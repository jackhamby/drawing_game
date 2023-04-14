
import express, { Request, Response } from "express";
import { ResponsePayload, Lobby, UserException, UnauthorizedAccessException, UserJwtData } from "../types";
import { authenticateToken as validateToken, getRequestUser, skipAuth } from "../utils/auth";
import { createLobby, getLobbies, getLobby, joinLobby, leaveLobby } from "../infrastructure/lobby-manager";

const router = express.Router();

const randomNames = ["mike", "david", "sarah", "jim", "alexa", "monica", "joey", "changler"]
const randomLastnames = ["hamby", "choi", "lee", "mckenna", "mcloud", "tribianni", "geller", "jones"]
function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}



router.post("/debug/lobby/join", (request, response) => {
    let responsePayload: ResponsePayload;
    const randomUsername = `${randomNames[randomInteger(0, randomNames.length)]} ${randomLastnames[randomInteger(0, randomLastnames.length)]}`
    const randomUserId = randomInteger(0, 100000)
    const fakeJwtdata: UserJwtData = {
        username: randomUsername,
        userId: randomUserId,
    }
    joinLobby(fakeJwtdata, request.body.lobbyId)
    // const user = getRequestUser(request);

    // // TODO: validation on create request
    // try{
    //     result = joinLobby(user, request.body.lobbyId);
    // }
    // catch(exception: any){
    //     responsePayload = {
    //         data: null,
    //         error: {
    //             message: "an error has occured",
    //         }
    //     }
    //     if (exception instanceof UserException){
    //         responsePayload.error.message = exception.message;
    //         return response.status(400).json(responsePayload);
    //     }

    //     return response.status(500).json(responsePayload);
    // }

    responsePayload = {
        data: "test",
        error: null,
    }

    return response.status(201).json(responsePayload);
});


router.post("/debug/lobby", (request, response) => {
    let result;
    let responsePayload: ResponsePayload;
    const randomUsername = `${randomNames[randomInteger(0, randomNames.length)]} ${randomLastnames[randomInteger(0, randomLastnames.length)]}`
    const randomUserId = randomInteger(0, 100000)
    const fakeJwtdata: UserJwtData = {
        username: randomUsername,
        userId: randomUserId,
    }
    const fakeLobbyData = {
        maxPlayers: 8,
        name: `${randomUsername}'s game`,

    }
    result = createLobby(fakeJwtdata, fakeLobbyData as Lobby)
    // const user = getRequestUser(request);

    // // TODO: validation on create request
    // try{
    //     result = joinLobby(user, request.body.lobbyId);
    // }
    // catch(exception: any){
    //     responsePayload = {
    //         data: null,
    //         error: {
    //             message: "an error has occured",
    //         }
    //     }
    //     if (exception instanceof UserException){
    //         responsePayload.error.message = exception.message;
    //         return response.status(400).json(responsePayload);
    //     }

    //     return response.status(500).json(responsePayload);
    // }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(201).json(responsePayload);
});

export default router;