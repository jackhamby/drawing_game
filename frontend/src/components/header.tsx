import useAuth from "../hooks/useAuth";
import "./header.scss";

export const Header = () => {

    const { logout, userSession } = useAuth()

    return (
        <header className="header">
            <h3 className="title"> the drawing game</h3>
            {/* <div className="menu">
                <select value="">
                    <option style={{display: "none", alignItems: 'end'}} selected>&#9660;</option>
                    <option> account </option>
                    <option> logout </option>
                </select>
            </div> */}
            {/* <div>

            </div>
            <div>
                test
            </div> */}
            {/* <h4>hello, {userSession?.username}</h4> */}
            <div className="actions">
                hello, {userSession?.username} &nbsp;&nbsp;
                <button className="menu" onClick={() => logout()}>logout</button>
            </div>
        </header>
    )
}