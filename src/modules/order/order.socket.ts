import AppError from "../../common/utils/AppError";
import { getIO, getUserSocketMap } from "../../socket";
import { deleteOrder, FullOrder } from "./order.repository";
import { UpdateOrderStatusService } from "./order.service";
import { OrderStatus } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { OrderRoom } from "../../types/OrderRoom.types";

// Generate a consistent room and return socket IDs
export const generateRoomID = (user_id: string, chef_id: string): OrderRoom => {
  const socketMap = getUserSocketMap();
  const chef_sid = socketMap.get(chef_id);
  const user_sid = socketMap.get(user_id);

  if (!chef_sid || !user_sid) {
    throw new AppError("Both users must be online to establish a room.", 400);
  }

  return {
    user_sid,
    chef_sid,
    room: `room-${user_id}-${chef_id}`,
  };
};

// Join both sockets to the same room
export const joinOrderCreationRoom = (user_id: string, chef_id: string): OrderRoom => {
  const io = getIO();
  const { user_sid, chef_sid, room } = generateRoomID(user_id, chef_id);
  [user_sid, chef_sid].forEach(id => io.sockets.sockets.get(id)?.join(room));
  return { user_sid, chef_sid, room };
};

// Emit order creation event
export const emitOrderCreated = async (user_id: string, chef_id: string, order: FullOrder) => {
  const io = getIO();
  const { room } = joinOrderCreationRoom(user_id, chef_id);
  io.to(room).emit("order:created", { order });
};

// Handle order responses and updates
export const handleOrderCreatedResponse = (io: Server, socket: Socket) => {
  socket.on("order:response", async (data: { user_id: string; chef_id: string; order_id: string; order_status: OrderStatus }) => {
    const { user_id, chef_id, order_id, order_status } = data;
    const { user_sid, room } = generateRoomID(user_id, chef_id);

    if (order_status === OrderStatus.DECLINED) {
      await deleteOrder(order_id);
      io.to(user_sid).emit("order:cancelled", {
        order_id,
        order_status,
        message: "Your order request has been cancelled by the chef",
      });
      io.in(room).socketsLeave(room);
    } else {
      await UpdateOrderStatusService(order_id, OrderStatus.ACCEPTED);
      io.to(user_sid).emit("order:accepted", {
        order_id,
        order_status,
        message: "Your order has been accepted by the chef",
      });
    }
  });

  socket.on("order:status:update", async (data: { user_id: string; chef_id: string; order_id: string; order_status: OrderStatus }) => {
    const { user_id, chef_id, order_id, order_status } = data;
    const { user_sid, room } = generateRoomID(user_id, chef_id);

    await UpdateOrderStatusService(order_id, order_status);

    const messages: Record<OrderStatus, string> = {
      [OrderStatus.COOKING]: "Your order is being cooked now. Get ready to pick it up soon!",
      [OrderStatus.DONE]: "Your order is done and ready to be picked up.",
      [OrderStatus.PENDING]: "",
      [OrderStatus.ACCEPTED]: "",
      [OrderStatus.DECLINED]: "",
    };

    io.to(user_sid).emit("order:status:update", {
      order_id,
      order_status,
      message: messages[order_status],
    });

    if (order_status === OrderStatus.DONE) {
      io.in(room).socketsLeave(room);
    }
  });
};

