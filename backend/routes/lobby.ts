
import express, { Request, Response } from "express";
import { ErrorCode, ResponsePayload, Lobby } from "../types";
import { authenticateToken } from "../utils/auth";
import { createLobby, getLobbies } from "../infrastructure/lobby-manager";

const router = express.Router();

router.get("/lobby", authenticateToken, (request, response) => {
    // response.status(200).json(getLobbies())
    let result: Lobby[] = [];
    let responsePayload: ResponsePayload;
    try{
        console.log(request.body)
        result = getLobbies()
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                errorCode: ErrorCode.unknown,
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
    try{
        console.log(request.body)
        result = createLobby(request.body);
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                errorCode: ErrorCode.unknown,
                message: "An error occured",
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

export default router;