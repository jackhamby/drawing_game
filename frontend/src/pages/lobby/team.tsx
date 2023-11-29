import { Lobby } from "../../utils/types";


interface TeamProps {
    lobby: Lobby
}

export const Team = (props: TeamProps) => {
    const { lobby } = props
    if (!lobby){
        return <div>Lobby not found</div>
    }
    return (
        <>
            <div className="team1">
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
        </>
    )
}

