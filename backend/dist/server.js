"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const process_1 = __importDefault(require("process"));
const types_1 = require("./types");
const user_1 = require("./data-access/user");
const user_manager_1 = require("./infrastructure/user-manager");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // TODO: add specific origins
dotenv_1.default.config();
const authenticateToken = (request, response, next) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return response.sendStatus(401);
    const isValid = (0, user_manager_1.validateToken)(token);
    if (isValid)
        return next();
    return response.sendStatus(401);
};
const server = app.listen(8000, () => {
    console.log(`listeing on ${port}`);
});
app.get("/test", authenticateToken, (request, response) => {
    response.send("hello");
});
app.post("/user", (request, response) => {
    // TODO: validation on the request
    try {
        (0, user_manager_1.createUser)(request.body);
    }
    catch (exception) {
        const responsePayload = {
            data: null,
            error: {
                errorCode: types_1.ErrorCode.unknown,
                message: "An error occured",
            }
        };
        return response.status(500).json(responsePayload);
    }
    return response.sendStatus(201);
});
app.post("/login", (request, response) => {
    let result;
    let responsePayload;
    try {
        console.log(request.body);
        result = (0, user_manager_1.loginUser)(request.body);
    }
    catch (exception) {
        responsePayload = {
            data: null,
            error: {
                errorCode: types_1.ErrorCode.unknown,
                message: "An error occured",
            }
        };
        return response.status(500).json(responsePayload);
    }
    responsePayload = {
        data: result,
        error: result ? null : {
            errorCode: types_1.ErrorCode.loginFailed,
            message: "login failed"
        }
    };
    return response.status(200).json(responsePayload);
});
const handleServerClose = () => {
    server.close((error) => {
        if (error) {
            console.error(`Failed to close express server: ${error.message}`);
            return;
        }
        console.log("Closed express server");
    });
};
process_1.default.on("exit", () => {
    console.log("server exited");
    handleServerClose();
    (0, user_1.closeDbConnection)();
});
process_1.default.on("SIGINT", () => {
    console.log("server killed");
    handleServerClose();
    (0, user_1.closeDbConnection)();
});
//# sourceMappingURL=server.js.map