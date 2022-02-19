
import express, { Request, Response } from "express";
import { CreateUser, ErrorCode, Login, ResponsePayload, User } from "../types";
import { createUser, loginUser } from "../infrastructure/user-manager";
import { authenticateToken } from "../utils/auth";

const router = express.Router();

router.get("/test", authenticateToken, (request, response) => {
    response.send("hello");
});

router.post("/user", (request: Request<{}, {}, CreateUser>, response: Response) => {
    // TODO: validation on the request
    try {
        createUser(request.body);
    }
    catch(exception: any){
        const responsePayload: ResponsePayload = {
            data: null,
            error: {
                errorCode: ErrorCode.unknown,
                message: "An error occured",
            }
        }
        return response.status(500).json(responsePayload);
    }

    return response.sendStatus(201);
});

router.post("/login", (request: Request<{}, {}, Login>, response: Response) => {
    let result;
    let responsePayload: ResponsePayload;
    try{
        console.log(request.body)
        result = loginUser(request.body);
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
        error: result ? null : {
            errorCode: ErrorCode.loginFailed,
            message: "login failed"
        }
    }

    return response.status(200).json(responsePayload);
});


export default router;