
import express, { Request, Response } from "express";
import { CreateUser, Login, LoginResponse, ResponsePayload, User } from "../types";
import { createUser, loginUser } from "../infrastructure/user-manager";
import { authenticateToken } from "../utils/auth";

const router = express.Router();

router.get("/test", authenticateToken, (request, response) => {
    response.send("hello");
});

router.post("/signup", (request: Request<{}, {}, CreateUser>, response: Response) => {
    // TODO: validation on the request
    let result: LoginResponse;
    let responsePayload: ResponsePayload;
    try {
       result = createUser(request.body);
    }
    catch(exception: any){
        responsePayload = {
            data: null,
            error: {
                message: "An error occured",
            }
        }
        console.error(exception)
        return response.status(500).json(responsePayload);
    }

    responsePayload = {
        data: result,
        error: result ? null : {
            message: "signup failed"
        }
    }

    return response.status(201).json(responsePayload)
});

router.post("/login", (request: Request<{}, {}, Login>, response: Response) => {
    let result: LoginResponse;
    let responsePayload: ResponsePayload;
    try{
        result = loginUser(request.body);
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
        error: result ? null : {
            message: "login failed"
        }
    }

    return response.status(200).json(responsePayload);
});


export default router;