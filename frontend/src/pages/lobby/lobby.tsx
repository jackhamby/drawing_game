import { FormEvent, useEffect, useRef, useState } from "react";
// import { Prompt } from "react-router";
import { usePrompt } from "../../hooks/__temp_usePrompt";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { get, post } from "../../utils/apis";
import { Lobby as LobbyType, SocketEvent, SocketEvents, ChatMessage} from "../../utils/types";
import { Team } from './team'
import "./lobby.scss";
import { Chat } from "./chat";
import { API_HOST } from "../../settings"
import { Game } from "../game/game";

export const Lobby = () => {
    let { id } = useParams();
    const socketRef = useRef<WebSocket>();
    const { userSession } = useAuth();
    const [lobby, setLobby] = useState<LobbyType | null>();
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    // const [redirectUrl, setRedirectUrl] = useState<string>();

    const navigate = useNavigate();
    const isHost = lobby?.hostUserId === userSession?.userId;
    // const formRef = useRef<HTMLFormElement>(null);
    // const chatInputRef = useRef<HTMLInputElement>(null)
    // const chatContainerRef = useRef<HTMLDivElement>(null)
    // // TODO: should we just read this off the lobby?
    // const [messages, setMessages] = useState<ChatMessage[]>([])


    const startGame = () => {
        if (!lobby) return
        if (!lobby.team1 || !lobby.team2){
            return
        }
        // TODO: uncomment this
        // if (!isHost){
        //     return
        // }
        if (lobby?.team1.players.length + lobby?.team2.players.length !== lobby?.maxPlayers){
            // TODO: uncomment this

            // window.alert("LOBBY IS NOT FULL")

            // return
        }



        post(`/lobby/${id}/start`, {}).then((resp) => {
            console.log("STarting lobby1")
            console.log(resp)
        })
    }

    usePrompt((location, action) => {
        if (lobby == null) return null
        if (isHost) return "do you want to leave lobby? this will close the lobby for all other players you bozo"

        return "are you sure you want to leave the lobby bozo?"
    })

    useEffect(() => {
        const getLobby = async () => {
            const response = await get<LobbyType>(`/lobby/${id}`);
            setLobby(response?.data);
            // setMessages(response?.data.chatMessages)
        }

        getLobby();

    }, [id])

    useEffect(() => {
        const leaveLobby = async () => {
            await post<boolean>("/lobby/leave", {
                lobbyId: id,
            });
        }

        return () => {
            leaveLobby();
        }
    }, [id])

    useEffect(() => {
        const socket = new WebSocket(`ws://${API_HOST}?token=${userSession?.token}`);

        // const socket = new WebSocket(`ws://localhost:8000?token=${userSession?.token}`);
        // const socket =new WebSocket(`wss://cca3-2601-445-680-5790-8403-8f58-184-60b0.ngrok-free.app?token=${userSession?.token}`)

        socket.onopen = (event) => {
            console.log("opened");
            socket.send(JSON.stringify({
                "event": "CONNECTION"
            }));
        }

        socket.onclose = (event) => {
            console.log("closed")
        }

        socket.onmessage = (event: MessageEvent<string>) => {
            console.log('recieved')
            console.log(event)
            let data: SocketEvent;
            try {
                data = JSON.parse(event.data);
                console.log(data)
            }
            catch {
                console.warn("failed to parse socket message");
                return;
            }
            
            switch(data.event){
                case(SocketEvents.LOBBY_UPDATED):

                    // TODO: any lobby updated event should
                    // not be broadcasted to everyone.
                    // But the dashboard page needs to listen to this event to 
                    // get updates from all lobbies.
                    if (data.payload.id !== lobby?.id){
                        break
                    }

                    console.log('got lobby updated event')
                    setLobby({...data.payload})
                    
                    break;
                case(SocketEvents.LOBBY_CLOSED):
                    // console.log("LOBBY CLOSED FUCKER")
                    // window.alert("this lobby was closed")
                    if (lobby && lobby.id === data.payload){
                        window.alert("this lobby is closing!")
                        setLobby(null)
                        // navigate("/")
                    }

                    break;
                case(SocketEvents.GAME_STARTED):
                    console.log("SERVER TOLD ME GAME TARTED")
                    setGameStarted(true)
                    setLobby(data.payload)
                    break;
                // case SocketEvents.LOBBY_CHAT_MESSAGE:
                //     console.log('got a lobby chat message')
                //     setMessages(data.payload)
                //     if (chatContainerRef.current){
                //         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                //     }
                //     break;
                default:
                    return; 
            }
        }

        socketRef.current = socket;
        
        return () => {
            socketRef?.current?.close();
        }
    }, [lobby, userSession?.token]);


    if (lobby === null){
        return ( 
            <>
                <div className="not-allowed">
                    You can't access this lobby <br/>
                    <button onClick={() => {
                        navigate("/")
                    }}> Go back to lobbies</button>
                </div>
            </>
        );
    }

    if (lobby === undefined){
        return <div> Loading lobby</div>
    }


    let currentPlayerCount = 0
    if (lobby){
        currentPlayerCount = lobby.team1.players.length + lobby.team2.players.length
    }

    if (gameStarted && lobby.game){
        return <div>
            <Game lobby={lobby}/>
        </div>
    }

    return (

        <div className="wrapper">

            { isHost 
                ? <div> THIS IS HOST </div>
                : null 
            }
            <div>
                {currentPlayerCount}/{lobby?.maxPlayers}
            </div>
            <div className="team-container">
                <Team lobby={lobby}/>
            </div>

            {/* TODO: SHOULD THIS BE WRAPPED */}
            <Chat lobby={lobby}/>

            <div className="settings">
                <button onClick={startGame}> start game</button>
            </div>
            <div className="footer">
            </div>
        </div>

    );
}
