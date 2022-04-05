import { useState } from "react";
import "./signup.scss";

export const SignUp = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();

    return (
        <div className="signup-wrapper">
            <form className="signup-form">
                <div></div>
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
                        // setPassword(e.target.value);
                    }}
                />
                <label htmlFor="password">confirm password:</label>
                <input
                    id="password"
                    type="password"
                    onChange={(e) => {
                        // setPassword(e.target.value);
                    }}
                />
                <p className="error-text">{error}</p>
                <input value="sign up" type="submit" className="signup-button" disabled={!password || !username}/>
            </form>
            {/* <form className="signup-form" onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const isSuccessful = await login(username!, password!);
                if (!isSuccessful) setError("failed to login");
            }}>
                <div></div>
                <label className="signup-label" htmlFor="username">username:</label>
                <input
                    className="signup-input"
                    id="username"
                    type="text"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <label className="signup-label" htmlFor="password">password:</label>
                <input
                    className="signup-input"
                    id="password"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <p className="error-text">{error}</p>
                <input value="sign up" type="submit" className="signup-button" disabled={!password || !username}/>
            </form> */}
        </div>
    )
}