import { useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { get, post } from "../../utils/apis";
import "./signup.scss";

export const SignUp = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [error, setError] = useState<string | null>();
    const [success, setSuccess] = useState(false)
    const { userSession, signup } = useAuth();

    // const signup = async () => {
    //     const response = await post<string>("/signup", {
    //         username,
    //         password
    //     });
    //     if (!response.error){
    //         console.log("Success bithc")
    //         setSuccess(true)
    //         setError(null)
    //     }
    //     else {
    //         setSuccess(false)
    //         setError(response.error.message || "An error has occured.")
    //     }
    // }

    if (success){
        return <Navigate to="/"/>
    }

    if (userSession?.token){
        return <Navigate to="/"/>
    }
    
    return (
        <div className="signup-wrapper">
            <form className="signup-form" onSubmit={async (e) => {
                e.preventDefault();
                if (!username || !password) return

                const response = await signup(username, password);
                if (!response.error){
                    setSuccess(true)
                    setError(null)
                }
                else {
                    setSuccess(false)
                    setError(response.error.message || "An error has occured.")
                }
            }}>
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
                        setPassword(e.target.value);
                    }}
                />
                <label htmlFor="password">confirm password:</label>
                <input
                    id="confirmPassword"
                    type="password"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                />
                <p className="error-text">{error}</p>
                <input value="sign up" type="submit" className="signup-button" disabled={!password || !username || (password !== confirmPassword)}/>
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