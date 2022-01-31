import express, { Request, Response }  from "express";
import cors from "cors"
import process from "process";
import { CreateUser, ErrorCode, Login, ResponsePayload, User } from "./types";
import { closeDbConnection } from "./data-access/user";
import { createUser, loginUser, validateToken } from "./infrastructure/user-manager";
import dotenv from "dotenv";

const app = express();
const port = 8000;
app.use(express.json());
app.use(cors()); // TODO: add specific origins
dotenv.config();

const authenticateToken = (request: Request, response: Response, next: any) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return response.sendStatus(401)

    const isValid = validateToken(token);
    if (isValid) return next();
    return response.sendStatus(401);
}

const server = app.listen(8000, () => {
    console.log(`listeing on ${port}`)
});

app.get("/test", authenticateToken, (request, response) => {
    response.send("hello");
});

app.post("/user", (request: Request<{}, {}, CreateUser>, response: Response) => {
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

app.post("/login", (request: Request<{}, {}, Login>, response: Response) => {
    let result;
    try{
        result = loginUser(request.body);
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

    const responsePayload: ResponsePayload = {
        data: result,
        error: null,
    }

    return response.status(200).json(responsePayload);
});

const handleServerClose = () => {
    server.close((error) => {
        if (error){
            console.error(`Failed to close express server: ${error.message}`);
            return;
        }
        console.log("Closed express server");
    });
}

process.on("exit", () => {
    console.log("server exited");
    handleServerClose();
    closeDbConnection();
});

process.on("SIGINT", () => {
    console.log("server killed");
    handleServerClose();
    closeDbConnection();
});