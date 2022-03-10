
import express, { Request, Response } from "express";
import { ResponsePayload, Lobby, UserException } from "../types";
import { authenticateToken, getRequestUserId } from "../utils/auth";
import { createLobby, getLobbies, joinLobby } from "../infrastructure/lobby-manager";

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

router.post("/lobby", authenticateToken, (request, response) => {
    let result;
    let responsePayload: ResponsePayload;

    // TODO: validation on create request
    // try{
        result = createLobby(request.body);
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
    const userId = getRequestUserId(request);

    // TODO: validation on create request
    try{
        result = joinLobby(userId, request.body.lobbyId);
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
        }

        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: null,
    }

    return response.status(201).json(responsePayload);
})

export default router;