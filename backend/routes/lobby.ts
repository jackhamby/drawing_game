
import express, { Request, Response } from "express";
import { ResponsePayload, Lobby, UserException, UnauthorizedAccessException } from "../types";
import { authenticateToken as validateToken, getRequestUser, skipAuth } from "../utils/auth";
import { createLobby, getLobbies, getLobby, joinLobby, leaveLobby, messageLobby } from "../infrastructure/lobby-manager";
import { startGame } from "../infrastructure/game-manager";

const router = express.Router();


const DEBUG = true
const authenticateToken = DEBUG ? skipAuth : validateToken

router.get("/lobby", authenticateToken, (request, response) => {
    let result: Lobby[] = [];
    let responsePayload: ResponsePayload;
    try{
        result = getLobbies()
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "An error occured",
            }
        }
        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(200).json(responsePayload);
});

router.get("/lobby/:lobbyId", authenticateToken, (request, response) => {
    let result: Lobby;
    let responsePayload: ResponsePayload;
    const userId = getRequestUser(request).userId;

    try{
        result = getLobby(userId, request.params.lobbyId);
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "An error occured",
            }
        }

        if (exception instanceof UnauthorizedAccessException){
            responsePayload.error.message = exception.message;
            return response.status(403).json(responsePayload);
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(200).json(responsePayload);
});


router.post("/lobby", authenticateToken, (request, response) => {
    let result;
    let responsePayload: ResponsePayload;
    const user = getRequestUser(request);

    // TODO: validation on create request
    try{
        result = createLobby(user, request.body);
        // throw Error();
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "An error occured"
            }
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(201).json(responsePayload);
})

router.post("/lobby/:lobbyId/start", authenticateToken, (request, response) => {
    let result;
    let responsePayload: ResponsePayload;
    const user = getRequestUser(request);

    try{
        result = startGame(user, request.params.lobbyId)
    }
    catch(exception: any){
        console.log(exception)
        responsePayload = {
            data: null,
            error: {
                message: "an error has occured",
            }
        }
        if (exception instanceof UserException){
            responsePayload.error.message = exception.message;
            return response.status(400).json(responsePayload);
        }
        else if (exception instanceof UnauthorizedAccessException){
            responsePayload.error.message = exception.message;
            return response.status(403).json(responsePayload);
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(201).json(responsePayload);
});

router.post("/lobby/join", authenticateToken, (request, response) => {
    let result;
    let responsePayload: ResponsePayload;
    const user = getRequestUser(request);

    // TODO: validation on create request
    try{
        result = joinLobby(user, request.body.lobbyId);
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "an error has occured",
            }
        }
        if (exception instanceof UserException){
            responsePayload.error.message = exception.message;
            return response.status(400).json(responsePayload);
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(201).json(responsePayload);
});


router.post("/lobby/leave", authenticateToken, (request, response) => {
    let result;
    let responsePayload: ResponsePayload;
    const userId = getRequestUser(request).userId;
    // TODO: validation on create request
    try{
        result = leaveLobby(userId, request.body.lobbyId);
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "an error has occured",
            }
        }
        if (exception instanceof UserException){
            responsePayload.error.message = exception.message;
            return response.status(400).json(responsePayload);
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(200).json(responsePayload);
});



router.post("/lobby/:lobbyId/message", authenticateToken, (request, response) => {
    let result: boolean;
    let responsePayload: ResponsePayload;
    const requestUser = getRequestUser(request);
    const userId = requestUser.userId;
    const username = requestUser.username;

    try{
        // TODO: validate request shape
        result = messageLobby(userId, request.params.lobbyId, request.body.message, username);

    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "An error occured",
            }
        }

        if (exception instanceof UnauthorizedAccessException){
            responsePayload.error.message = exception.message;
            return response.status(403).json(responsePayload);
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(200).json(responsePayload);
});



export default router;