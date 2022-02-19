import { useEffect, useState } from "react";
import { Modal } from "../../components/modal";
import { get } from "../../utils/apis";
import { Lobby } from "../../utils/types";
import "./home.scss";

export const Home = () => {
    const [lobbies, setLobbies] = useState<Lobby[]>([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getLobbies = async () => {
            setIsLoading(true);
            const response = await get<Lobby[]>("/lobby");
            setIsLoading(false);
            if (response){
                setLobbies(response.data)
            }

        }

        getLobbies();
    }, [])

    if (isLoading){
        return <div>Loading...</div>
    }

    console.log(lobbies)
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
                    <tbody>
                        {lobbies?.map((lobby) => {
                            return (
                                <tr>
                                    <td>
                                        {lobby.name}
                                    </td>
                                    <td>
                                        {lobby.players.length}/{lobby.maxPlayers}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="buttons-container"> 
                <button> Join game</button>
                <button> Create game</button>
                <Modal
                    modalContent={<>asdasd</>}
                    onClose={() => console.log("closed")}
                    onConfirm={() => console.log("confirmed")}
                />
            </div>
        </div>
    )
}