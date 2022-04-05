import { create } from "domain";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { FormModal } from "../../components/form-modal";
import useAuth from "../../hooks/useAuth";
import { get, post } from "../../utils/apis";
import { Lobby, LobbyCreate, SocketEvent, SocketEvents } from "../../utils/types";
import "./lobby-dashboard.scss";
import { LobbyForm } from "./lobby-form";

export const LobbyDashboard = () => {
    const [lobbies, setLobbies] = useState<Lobby[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [selectedGame, setSelectedGame] = useState<string | null>();
    const [redirectUrl, setRedirectUrl] = useState<string>();
    const tableBodyRef = useRef<HTMLTableSectionElement>(null);
    const socketRef = useRef<WebSocket>();
    const { userSession } = useAuth();

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000?token=${userSession?.token}`);
        socket.onopen = (event) => {
            console.log("opened");
            socket.send(JSON.stringify({
                "event": "CONNECTION"
            }));
        }

        socket.onclose = (event) => {
            console.log("closed!")
        }

        socket.onmessage = (event: MessageEvent<string>) => {
            console.log('recieved')
            console.log(event)
            let data: SocketEvent;
            try {
                data = JSON.parse(event.data);
            }
            catch {
                console.warn("failed to parse socket message");
                return;
            }
            
            switch(data.event){
                case(SocketEvents.LOBBY_CREATED):
                    setLobbies((currentLobbies) => [data.payload, ...currentLobbies ]);
                    break;
                case(SocketEvents.LOBBY_UPDATED): // TODO: do we even need this? just make one lobbies updated event
                    setLobbies((currentLobbies) => {
                        const updatedLobby: Lobby = data.payload;
                        return currentLobbies.map((lobby) => {
                            if (lobby.id === updatedLobby.id){
                                return updatedLobby;
                            }
                            return lobby;
                        });
                    });
                    break;
                default:
                    return;
            }
        }

        socketRef.current = socket;

        const handleDocumentClick = (event: MouseEvent) => {
            // If they click outside the table set their selected game to null
            if (tableBodyRef?.current && !tableBodyRef.current.contains(event.target as Node)){
                setSelectedGame(null);
            }
        }

        const getLobbies = async () => {
            setIsLoading(true);
            const response = await get<Lobby[]>("/lobby");
            setIsLoading(false);
            if (response){
                // const temp = [...response.data, ...response.data, ...response.data, ...response.data, ...response.data, ...response.data, ...response.data]
                // setLobbies(temp)
                setLobbies(response.data)
            }
        }

        document.addEventListener("click", handleDocumentClick);

        getLobbies();
        return () => {
            document.removeEventListener("click", handleDocumentClick);
            socketRef?.current?.close();
        }
    }, [])

    const getLobbyPlayerCount = (lobby: Lobby) => {
        return lobby.team1.players.length + lobby.team2.players.length;
    }

    const createLobby = async (lobbyData: LobbyCreate) => {
        const response = await post<string>("/lobby", lobbyData);
        if (!response.error){
            setRedirectUrl(`/lobby/${response.data}`);
        }
        return response;
    }

    const joinLobby = async () => {
        const response = await post<boolean>("/lobby/join", {
            lobbyId: selectedGame,
        });
        if (!response.error){
            setRedirectUrl(`/lobby/${selectedGame}`);
        }
    }

    const canJoinGame = () => {
        if (!selectedGame){
            return false;
        }
        const selectedLobby = lobbies.find((lobby) => lobby.id === selectedGame);
        if (!selectedLobby){
            return false;
        }
        if (getLobbyPlayerCount(selectedLobby) >= selectedLobby.maxPlayers){
            return false;
        }
        return true;
    }

    if (isLoading){
        return <div>Loading...</div>
    }

    if (redirectUrl){
        return <Navigate to={redirectUrl}/>
    }

    return (

        <div className="home-wrapper"> 
            <div className="table-wrapper">
                <table className="lobby-table">
                    <thead>
                        <tr>
                            <th>
                                name
                            </th>
                            <th>
                                players
                            </th>
                        </tr>

                    </thead>
                    <tbody ref={tableBodyRef}>
                        {lobbies?.map((lobby) => {
                            return (
                                <tr key={lobby.id} className={selectedGame === lobby.id ? "selected" : ""} onClick={() => setSelectedGame(lobby.id)}>
                                    <td>
                                        {lobby.name}
                                    </td>
                                    <td>
                                        {getLobbyPlayerCount(lobby)}/{lobby.maxPlayers}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="buttons-container"> 
                <button 
                    disabled={!canJoinGame()}
                    onClick={(event) => {
                        joinLobby()
                    }}
                    > join game</button>
                <FormModal
                    link={<button> create game</button>}
                    content={
                        <LobbyForm/>
                    }
                    onSubmit={async (data: any) => {
                        const response = await createLobby(data)
                        return response;
                    }}
                />
            </div>
        </div>
    )
}