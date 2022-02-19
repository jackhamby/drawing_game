import express from "express";
import cors from "cors"
import process from "process";
import { closeDbConnection } from "./data-access/user";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import lobbyRoutes from "./routes/lobby";
const app = express();
const port = 8000;

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