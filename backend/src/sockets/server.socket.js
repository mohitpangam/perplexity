import { Server } from "socket.io";

let io;

export function initSocket(httpServer){
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    console.log("socket intialized")

    io.on("connection", (socket) => {
        console.log("A user connected to server: "+ socket.id)
    })
}

export function getIO(){
    if(!io){
        throw new Error("Socket not initialized");        
    }

    return io
}
