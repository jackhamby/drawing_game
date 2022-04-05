import { Lobby, SocketConnection } from "../types";
import ws from "ws";
import { getUser, validateToken } from "../utils/auth";
import url from "url";

const sockets: SocketConnection[] = []


const broadcastMessage = (message: any) => {
    sockets.forEach((socketConnection) => {
        socketConnection.socket.send(JSON.stringify(message))
    })
}

export const sendLobbyCreateEvent = (lobby: Lobby) => {
    broadcastMessage({
        event: "LOBBY_CREATED",
        payload: lobby
    });
}

export const sendLobbyUpdatedEvent = (lobby: Lobby) => {
    broadcastMessage({
        event: "LOBBY_UPDATED",
        payload: lobby
    })
}



export const initWebsocketServer = (server: ws.WebSocketServer) => {
    server.on('connection', (socket, request) => {
        const data = url.parse(request.url, true).query;
        const token = data.token as string;
        if (!data.token || !validateToken(token) ){
            socket.close();
            return;
        }
        const userId = getUser(token).userId;

        const handleMessage = (message: any) => {
            switch(message.event){
                case ("CONNECTION"):
                    const socketConnection: SocketConnection = {
                        userId,
                        socket,
                        gameId: message.payload?.gameId,
                        authToken: token,
                    }
                    sockets.push(socketConnection)
                    return;
                default:
                    console.warn(`unhandled event type ${message.event}`)
                    return;
            }
        }

        socket.on('message', message =>  {
            console.log(message.toString());
            let content;
            try {
                content = JSON.parse(message.toString());
                handleMessage(content);
            }
            catch(e) {
                console.error("failed to parse json")
            }
        });
    });
}

