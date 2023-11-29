import { useRef, useState, FormEvent, useEffect } from "react";
import { ChatMessage, Lobby, SocketEvent, SocketEvents } from "../../utils/types";
import { get, post } from "../../utils/apis";
import useAuth from "../../hooks/useAuth";
import { API_HOST } from "../../settings"


interface ChatProps {
    lobby: Lobby
}

export const Chat = (props: ChatProps) => {
    const { lobby } = props
    const [messages, setMessages] = useState<ChatMessage[]>(lobby.chatMessages)
    const { userSession } = useAuth();
    const formRef = useRef<HTMLFormElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<WebSocket>();

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!formRef.current || !chatInputRef.current || !chatContainerRef.current) return;
        const formData = new FormData(formRef.current);
        const jsonData = Object.fromEntries(formData.entries());
        const message = jsonData['chat-input'].toString()

        chatInputRef.current.value = ''

        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

        const response = await post<string>(`/lobby/${lobby?.id}/message`, {"message": message});
        if (response.error){
            window.alert("ERROR")
        }
        return response;
    }



    useEffect(() => {
        const socket = new WebSocket(`ws://${API_HOST}?token=${userSession?.token}`);
        // const socket =new WebSocket(`wss://cca3-2601-445-680-5790-8403-8f58-184-60b0.ngrok-free.app?token=${userSession?.token}`)
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
                console.log(data)
            }
            catch {
                console.warn("failed to parse socket message");
                return;
            }
            
            switch(data.event){
                case SocketEvents.LOBBY_CHAT_MESSAGE:
                    console.log('got a lobby chat message')
                    setMessages(data.payload)
                    if (chatContainerRef.current){
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                    break;
                default:
                    return; 
            }
        }

        socketRef.current = socket;
        
        return () => {
            socketRef?.current?.close();
        }
    }, [lobby, userSession?.token]);



    return (
        // <div ref={chatContainerRef}>
        <div ref={chatContainerRef} className="chat">
            <div style={{ "marginBottom": "30px"}}>
                {
                    messages.map((message) => {
                        return <div style={{"paddingLeft": "10px"}}>{message.username}: {message.message}</div>
                    })
                }
            </div>
            <div style={{"alignSelf": "flex-end", "position": "sticky", "bottom": 0}}>
                <form onSubmit={submit} ref={formRef} style={{display: "grid"}}>
                    <input name="chat-input" type="text" id="chat-input" placeholder="Send a message..." className="chat-input" ref={chatInputRef}> 
                        
                    </input>
                </form>
            </div>
        </div>
    )
}