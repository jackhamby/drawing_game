"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const process_1 = __importDefault(require("process"));
const types_1 = require("./types");
const user_1 = require("./data-access/user");
const user_manager_1 = require("./infrastructure/user-manager");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 8000;
const server = app.listen(8000, () => {
    console.log(`listeing on ${port}`);
});
app.get("/test", (request, response) => {
    response.send("200 OK");
});
app.get("/test", (request, response) => {
    response.send("hello");
});
app.post("/user", (request, response) => {
    // TODO: validation on the request
    const responseCallBack = (error = null) => {
        if (error) {
            const responsePayload = {
                data: null,
                error: {
                    errorCode: types_1.ErrorCode.unknown,
                    message: "An error occured",
                }
            };
            return response.status(500).json(responsePayload);
        }
        return response.status(201);
    };
    (0, user_manager_1.createUser)(request.body, responseCallBack);
});
app.post("/login", (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    // db.all(`SELECT * FROM user WHERE username = ?`, [username], (error, rows: User[]) => {
    //     if (error){
    //         console.error(error.message);
    //         return;
    //     }
    //     if (rows.length === 1){
    //         console.log("found user");
    //         console.log(rows[0])
    //         const actualPassword = rows[0].password;
    //         const salt = rows[0].salt;
    //         const iterations = rows[0].iterations;
    //         pbkdf2(password, salt, iterations, 64, 'sha512', (error: Error, hash: Buffer) => {
    //             if (error){
    //                 console.error(`Failed to verify password has: ${error.message}`);
    //                 return;
    //             }
    //             // console.log(`hashed password ${hash}`);
    //             if (hash.toString("hex") === actualPassword){
    //                 console.log("success!")
    //             }
    //             else {
    //                 console.log("error!")
    //             }
    //         });
    //     }
    // });
    response.send("cool you logged in");
});
// const handleDatabaseClose = () => {
//     db.close((error) => {
//         if (error){
//             console.error(`Failed to close db connection: ${error.message}`);
//             return;
//         }
//         console.log("Closed db connection");
//     })
// }
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
    // handleDatabaseClose();
    handleServerClose();
    (0, user_1.closeDbConnection)();
});
process_1.default.on("SIGINT", () => {
    console.log("server killed");
    // handleDatabaseClose();
    handleServerClose();
    (0, user_1.closeDbConnection)();
});
//# sourceMappingURL=server.js.map