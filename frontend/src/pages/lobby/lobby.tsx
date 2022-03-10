import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { SocketEvent, SocketEvents } from "../../utils/types";

export const Lobby = () => {
    let { id } = useParams();
    const socketRef = useRef<WebSocket>();
    const { userSession } = useAuth()


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
                
            }
        }

        socketRef.current = socket;

        return () => {
            socketRef?.current?.close();
        }
    })

    return (
        <div> welcome to your new lobby {id}</div>

    );
}
