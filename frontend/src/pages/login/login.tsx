import { useState } from "react";
import { axiosClient } from "../.."

export const Login = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                axiosClient.post("/user", {
                    username,
                    password,
                })
            }}>
                <label htmlFor="username">username:</label>
                <input 
                    id="username"
                    type="text"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <label htmlFor="password">password:</label>
                <input
                    id="password"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <input type="submit"/>
            </form>

        </div>
    )


}