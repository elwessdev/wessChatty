import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173"],
    }
})
const usersSocket = new Map();

io.on("connection",(socket)=>{
    console.log("user connected ", socket.id);

    const user_id = socket.handshake.query.user_id;
    if(user_id){
        usersSocket.set(user_id, socket.id);
    }
    
    io.emit("getOnlineUsers",Array.from(usersSocket.keys()));

    // Disconnect
    socket.on("disconnect",()=>{
        console.log("user disconnected ", socket.id);
        usersSocket.delete(user_id);
        io.emit("getOnlineUsers",Array.from(usersSocket.keys()));
    })
})

export {server, app, usersSocket, io};