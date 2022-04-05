
import express, { Request, Response } from "express";
import { ResponsePayload, Lobby, UserException, UnauthorizedAccessException } from "../types";
import { authenticateToken, getRequestUser } from "../utils/auth";
import { createLobby, getLobbies, getLobby, joinLobby, leaveLobby } from "../infrastructure/lobby-manager";

const router = express.Router();

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
    // try{
        result = createLobby(user, request.body);
    // }
    // catch(exception: any){
    //     responsePayload = {
    //         data: null,
    //         error: {
    //             errorCode: ErrorCode.unknown,
    //             message: "An error occured",
    //         }
    //     }
    //     return response.status(500).json(responsePayload);
    // }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(201).json(responsePayload);
})

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


export default router;