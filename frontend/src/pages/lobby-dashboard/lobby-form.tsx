import { ChangeEvent, FormEvent, useState } from "react"
import { post } from "../../utils/apis";
import { LobbyCreate } from "../../utils/types";
import "./lobby-form.scss";

export const LobbyForm = () => {
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [name, setName] = useState("");
    
    return (
        <div className="lobby-form-wrapper">
            <label className="lobby-label" htmlFor="name"> lobby name: </label>
            <input 
                id="name"
                type="text" 
                name="name"
                required
                className="lobby-form-input"
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                }}
            />

            <label className="lobby-label" htmlFor="maxPlayers"> number of players </label>
            <select
                id="maxPlayers"
                name="maxPlayers" 
                className="lobby-form-input"
                required
                value={maxPlayers}
                onChange={(event) => {
                    setMaxPlayers(Number(event.target.value))
                }}
            >
                <option value={4}> 4 </option>
                <option value={6}> 6 </option>
                <option value={8}> 8 </option>
            </select>            
        </div>
    )
}