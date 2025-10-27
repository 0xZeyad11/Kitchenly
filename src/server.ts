import { Response, Request, NextFunction } from "express";
import { initSocket } from "./socket";
import app from "./app";
import http from "http";
import dotenv from "dotenv";
dotenv.config({ path: ["./src/config/config.env", ".env"], debug: true });
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🛟 Server Listenting On Port ${PORT}`);
});

export default server;
