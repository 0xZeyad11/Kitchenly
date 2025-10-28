import { Server } from "socket.io";
import http from "http";
import AppError from "./common/utils/AppError";
import { handleOrderCreatedResponse } from "./modules/order/order.socket";

let io: Server;

const UserSocketMap = new Map<string, string>(); // user id ===> socket id
export const getUserSocketMap = () => UserSocketMap;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`🔌 A user has connected using socket:  ${socket.id}`);
    console.log(
      `👥 Total number of connected clients ==> [${io.engine.clientsCount}]`,
    );

    socket.on("register", (userid: string) => {
      UserSocketMap.set(userid, socket.id);
      console.log(`🟢 Registered user ${userid} with socket ${socket.id}`);
    });
    socket.on("disconnect", (reason) => {
      console.log(
        `🔌 A user has disconnected from socket id : ${socket.id} ${reason}`,
      );
      console.log(
        `👥 Total number of connected clients ==> [${io.engine.clientsCount}]`,
      );

      for (const [userid, socketid] of UserSocketMap.entries()) {
        if (socketid === socket.id) {
          UserSocketMap.delete(userid);
          console.log(`🔴 User ${userid} disconnected`);
          break;
        }
      }
    });
    //TODO  add the socket handlers here
    handleOrderCreatedResponse(io, socket);
  });
};

export const getIO = () => {
  if (!io) {
    throw new AppError("There is no instance of the socket server!", 500);
  }
  return io;
};
