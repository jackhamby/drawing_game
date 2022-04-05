import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { get, post } from "../../utils/apis";
import { Lobby as LobbyType, SocketEvent, SocketEvents } from "../../utils/types";
import "./lobby.scss";

export const Lobby = () => {
    let { id } = useParams();
    const socketRef = useRef<WebSocket>();
    const { userSession } = useAuth();
    const [lobby, setLobby] = useState<LobbyType>();
    const navigate = useNavigate();

    useEffect(() => {
        const getLobby = async () => {
            const response = await get<LobbyType>(`/lobby/${id}`);
            setLobby(response?.data);
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
        const socket = new WebSocket(`ws://localhost:8000?token=${userSession?.token}`);
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
            }
            catch {
                console.warn("failed to parse socket message");
                return;
            }
            
            switch(data.event){
                // TODO:
            }
        }

        socketRef.current = socket;
        
        return () => {
            socketRef?.current?.close();
        }
    });

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

    return (
        <div className="wrapper">
            <div className="team1">
                {/* TODO: make DRY */}
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>
                                player
                            </th>
                            <th>
                                color
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lobby?.team1.players.map((player) => {
                            return (
                                <tr key={player.userId}>
                                    <td>{player.username}</td>
                                    <td>{player.color}</td>
                                </tr> 
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="team2">
                {/* TODO: make DRY */}
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>
                                player
                            </th>
                            <th>
                                color
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lobby?.team2.players.map((player) => {
                            return (
                                <tr key={player.userId}>
                                    <td>{player.username}</td>
                                    <td>{player.color}</td>
                                </tr> 
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="settings">
                <button> start game</button>
            </div>
            <div className="footer">
            </div>
        </div>
        // <div className="lobby-wrapper">
        //     <div className="team">
        //     </div>
        //     <div className="team">
        //     </div>
        //         {/* <div> welcome to your new lobby {id}</div>
        //         <div> current players...</div>
        //         <ul>
        //             {lobby?.players?.map((player) => {
        //                 return <li>user: {player.userId}</li>
        //             })}
        //         </ul> */}
        // </div>
//         <div className="wrapper">
//   <header className="main-head">The header</header>
//   <nav className="main-nav">
//     <ul>
//       <li><a href="">Nav 1</a></li>
//       <li><a href="">Nav 2</a></li>
//       <li><a href="">Nav 3</a></li>
//     </ul>
//   </nav>
//   <article className="content">
//     <h1>Main article area</h1>
//     <p>In this layout, we display the areas in source order for any screen less that 500 pixels wide. We go to a two column layout, and then to a three column layout by redefining the grid, and the placement of items on the grid.</p>
//   </article>
//   <aside className="side">Sidebar</aside>
//   <div className="ad">Advertising</div>
//   <footer className="main-footer">The footer</footer>
  
// </div>

    );
}
