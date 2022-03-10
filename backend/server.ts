import express from "express";
import ws from "ws";
import cors from "cors"
import process from "process";
import { closeDbConnection } from "./data-access/user";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import lobbyRoutes from "./routes/lobby";
import url from "url";
import { getUserId, validateToken } from "./utils/auth";
import { SocketConnection } from "./types";
import { initWebsocketServer } from "./infrastructure/socket-manager";

// create express app
const app = express();
const port = 8000;



// create websocket server
const wsServer = new ws.Server({ noServer: true });

initWebsocketServer(wsServer)

// add json serializer
app.use(express.json());

// add cors
app.use(cors()); // TODO: add specific origins

// register routes
app.use(userRoutes);
app.use(lobbyRoutes);

dotenv.config();

const server = app.listen(8000, () => {
    console.log(`listeing on ${port}`)
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, sock => {
      wsServer.emit('connection', sock, request);
    });
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