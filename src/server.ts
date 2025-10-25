import { Response, Request, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import app from "./app";
import dotenv from "dotenv";
dotenv.config({ path: ["./src/config/config.env", ".env"], debug: true });
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);
  io.on("disconnection", (socket) => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🛟 Server Listenting On Port ${PORT}`);
});
