import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../.."
import "./login.scss";
import { Link, Navigate } from "react-router-dom";
import useAuth, { UserSession } from "../../hooks/useAuth";

export const Login = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();
    const { login, userSession } = useAuth();

    if (userSession?.token){
        return <Navigate to="/"/>
    }

    return (
        <div className="login-wrapper">
            <h1 className="main-text-item">
                the drawing game
            </h1>
            <form className="login-item form-wrapper" onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const isSuccessful = await login(username!, password!);
                if (!isSuccessful) setError("failed to login");
            }}>
                <div></div>
                <label className="login-label" htmlFor="username">username:</label>
                <input
                    className="login-input"
                    id="username"
                    type="text"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <label className="login-label" htmlFor="password">password:</label>
                <input
                    className="login-input"
                    id="password"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <p className="error-text">{error}</p>
                <input value="login" type="submit" className="login-button" disabled={!password || !username}/>
            </form>
            <div className="link-item">
                <Link to="/signup" className="button-link login-link">sign up</Link>
            </div>

        </div>
    )


}