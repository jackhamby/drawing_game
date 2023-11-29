import { useCallback, useEffect, useRef, useState } from "react"
import { API_HOST } from "../../settings";
import useAuth from "../../hooks/useAuth";
import { Lobby, SocketEvent, SocketEvents } from "../../utils/types";
import { CountDownModal } from "../../components/countdown-modal";

interface GameProps {
    lobby: Lobby
}


export const Game = (props: GameProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [drawerCanvasRef, setDrawerCanvasRef] = useState<HTMLCanvasElement>()
    const socketRef = useRef<WebSocket>();
    const { userSession } = useAuth();
    const [currentRound, setCurrentRound] = useState(-1)
    const [roundTimer, setRoundTimer] = useState(props.lobby.game?.gameCountDown ?? 3)

    console.log(props.lobby)
    useEffect(() => {
        
        if (roundTimer > 0){
            setTimeout(() => {
                setRoundTimer(roundTimer - 1)
            }, 1000)
          
        }
        // if (currentRound === -1){
        //     const gameCountDown = props.lobby.game?.gameCountDown ?? 99999

        //     setRoundTimer(gameCountDown)

        //     const timer = setInterval(() => {
        //         setRoundTimer(roundTimer - 1)
        //     }, 1000)

        //     setTimeout(() => {
        //         clearInterval(timer)
        //     }, gameCountDown * 1000)
        // }
    
    }, [currentRound, roundTimer])

    useEffect(() => {
        if (!drawerCanvasRef){
            return
        }

        const socket = new WebSocket(`ws://${API_HOST}?token=${userSession?.token}`);

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
                case(SocketEvents.LOBBY_UPDATED):
                    break;
                case(SocketEvents.LOBBY_CLOSED):
                    break;
                case SocketEvents.LOBBY_CHAT_MESSAGE:
                    break;
                case SocketEvents.GAME_UPDATED:
                    if (!canvasRef?.current){
                        console.error("NO CANVAS REF")
                        return
                    }
                    const context = canvasRef.current.getContext('2d')
                    if (!context){
                        console.error("NO 2d context")
                        return
                    }
                    var img = new Image();
                    img.onload = function(){
                        context.drawImage(img,0,0); // Or at whatever offset you like
                    };
                    img.src = data.payload;
                    break;
                case SocketEvents.GAME_ENDED:
                    // TODO
                    break;
                case SocketEvents.ROUND_STARTED:
                    console.log("GOT ROUND STARTED EVENT")
                    const round = data.payload
                    setCurrentRound(round)
                    break;
                case SocketEvents.ROUND_ENDED:
                    console.log("GOT ROUND ENDED")
                    break
                default:
                    return; 
            }
        }

        socketRef.current = socket;
        
        return () => {
            socketRef?.current?.close();
        }
    }, [props.lobby, userSession?.token, drawerCanvasRef]);



    const canvasNode = useCallback((node: HTMLCanvasElement) => {
        if (node === null){
            return
        }

        console.log("GOT NODE")
        setDrawerCanvasRef(node);
        const context = node.getContext('2d');
        if (!context){
            return;
        }
        
        let mouseDown = false
        let x = 0
        let y = 0

        const startDrawing = (event: MouseEvent) => {
            mouseDown = true
            x = event.offsetX
            y = event.offsetY
        }
    
        const stopDrawing = () => {
            mouseDown = false
        }

        const draw = (event: MouseEvent) => {
            if (mouseDown){
                let newX = event.offsetX
                let newY = event.offsetY
                context.beginPath()
                context.moveTo(x, y)
                context.lineTo(newX, newY)
                context.stroke()
                context.strokeStyle = "red"

                x = newX
                y = newY

                const durl = node.toDataURL()
                if (socketRef?.current){
                    socketRef.current?.send(JSON.stringify({
                        "event": SocketEvents.GAME_UPDATED,
                        "payload": {
                            "id": props.lobby.id,
                            "dataUrl": durl
                        }
                    }))
                }
                // const i = new Image();
                // if (i === null) return;
    
                // // In case image take a sec to load
                // i.onload = (ev: Event) => {
                //     if (canvasRef.current){
                //         const ctx = canvasRef.current.getContext("2d")
                //         if (!ctx)return
                //         ctx?.drawImage(i, 0, 0)
                //     }
                // }
                // i.src = durl
            }        
        }


        node.addEventListener("mousedown", startDrawing)

        node.addEventListener("mouseup", stopDrawing)

        node.addEventListener("mousemove", draw)


    }, [])

    if (!props.lobby.game){
        return <div> Game is starting....</div>
    }


    const isDrawer = props.lobby.game?.activeTeam1Drawer === userSession?.userId
    // const countDown = props.lobby.game?.gameCountDown

    console.log(roundTimer)
    if (roundTimer > 0){
        console.log("round timer")
        return <CountDownModal content={roundTimer}/>
    }

    return <div>
        <div> Is Drawer {isDrawer}</div>
        <div> Round {currentRound}</div>
        <canvas width={500} height={500} ref={canvasNode} style={{ border: "1px 1px black"}}/>
        <canvas width={500} height={500} ref={canvasRef}style={{border: "1px 1px black", "position": "absolute"}} />
    </div>


}