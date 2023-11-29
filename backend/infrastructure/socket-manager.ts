import { Game, Lobby, SocketConnection, SocketEvent, SocketEvents } from "../types";
import ws from "ws";
import { getUser, validateToken } from "../utils/auth";
import url from "url";
import { getLobby } from "./lobby-manager";

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


export const sendLobbyChatMessageEvent = (lobby: Lobby) => {
    console.log('sending lobby message event')
    broadcastMessageToLobby({
        event: SocketEvents.LOBBY_CHAT_MESSAGE,
        payload: lobby.chatMessages
    }, lobby)
}


export const sendGameStartedEvent = (lobby: Lobby, game: Game) => {
    console.log('sending game started event')
    broadcastMessageToLobby({
        event: SocketEvents.GAME_STARTED,
        payload: game,
    }, lobby)
}

export const sendGameEndedEvent = (lobby: Lobby) => {
    console.log('sending game ended event')
    broadcastMessageToLobby({
        event: SocketEvents.GAME_ENDED,
    }, lobby)
}

export const sendRoundStartedEvent = (lobby: Lobby, game: Game, round: number) => {
    console.log('sending round started event')
    // TODO: filter
    broadcastMessageToLobby({
        event: SocketEvents.ROUND_STARTED,
        payload: {
            game,
            round,
        }
    }, lobby)
}

export const sendRoundEndedEvent = (lobby: Lobby) => {
    console.log('sending round ended event')
    broadcastMessageToLobby({
        event: SocketEvents.ROUND_ENDED,
    }, lobby)
}

export const sendGameUpdatedEvent = (lobby: Lobby, dataUrl: string) => {
    console.log('sending game updated event')
    broadcastMessageToLobby({
        event: SocketEvents.GAME_UPDATED,
        payload: dataUrl,
    }, lobby)
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

        const handleMessage = (message: SocketEvent) => {
            switch(message.event){
                case (SocketEvents.CONNECTION):
                    const socketConnection: SocketConnection = {
                        userId,
                        socket,
                        authToken: token,
                        lobbyId: null,
                    }
                    sockets.push(socketConnection)

                    return;
                case(SocketEvents.GAME_UPDATED):
                    console.log("server recieved game updated event")
                    console.log(message)
                    const lobbyId = message.payload.id
                    const dataUrl = message.payload.dataUrl
                    const lobby = getLobby(userId, lobbyId)
                    // TODO: validate userId is current drawer on their respective team
                    sendGameUpdatedEvent(lobby, dataUrl)
                    break;
                default:
                    console.warn(`unhandled event type ${message.event}`)
                    return;
            }
        }

        socket.on('message', message =>  {
            let content: SocketEvent;
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

