import { Lobby, SocketConnection, SocketEvents } from "../types";
import ws from "ws";
import { getUser, validateToken } from "../utils/auth";
import url from "url";

let sockets: SocketConnection[] = []


const broadcastMessage = (message: any) => {
    sockets.forEach((socketConnection) => {
        socketConnection.socket.send(JSON.stringify(message))
    })
}

const broadcastMessageToLobby = (message: any, lobby: Lobby) => {
    const players = [...lobby.team1.players, ...lobby.team2.players]
    const lobbySockets = sockets.filter((sock) => players.some((player) => player.userId === sock.userId))
    console.log(lobbySockets)
    lobbySockets.forEach((sock) => {
        sock.socket.send(JSON.stringify(message))
    })
}

export const sendLobbyCreateEvent = (lobby: Lobby) => {

    broadcastMessage({
        event: SocketEvents.LOBBY_CREATED,
        payload: lobby
    });
}


export const sendLobbyUpdatedEvent = (lobby: Lobby) => {
    broadcastMessage({
        event: SocketEvents.LOBBY_UPDATED,
        payload: lobby
    })
}


export const sendLobbyClosedEvent = (lobby: Lobby) => {
    console.log('sending lobby closed')
    broadcastMessage({
        event: SocketEvents.LOBBY_CLOSED,
        payload: lobby.id
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
                        authToken: token,
                        lobbyId: null,
                    }
                    sockets.push(socketConnection)

                    return;
                default:
                    console.warn(`unhandled event type ${message.event}`)
                    return;
            }
        }

        socket.on('message', message =>  {
            let content;
            try {
                content = JSON.parse(message.toString());
                handleMessage(content);
            }
            catch(e) {
                console.error("failed to parse json")
            }
        });

        socket.on("close", (code: number, reason: Buffer) => {
            sockets = sockets.filter((sock) => sock.socket !== socket)
        });
    });
}

