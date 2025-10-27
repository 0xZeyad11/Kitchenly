import AppError from "../../common/utils/AppError";
import { getIO, getUserSocketMap } from "../../socket";
import { deleteOrder, FullOrder } from "./order.repository";
const io = getIO();
export type IO = typeof io;

export const joinOrderCreationRoom = (userid: string, chefid: string) => {
  const roomid = `room-${userid}-${chefid}`;
  const socketid_map = getUserSocketMap();
  const chef_socketid = socketid_map.get(chefid);
  const user_socketid = socketid_map.get(userid);
  if (!chef_socketid || !user_socketid) {
    throw new AppError(
      "both users must be online to establish a room between them",
      400,
    );
  }
  [user_socketid, chef_socketid].forEach((id) =>
    io.sockets.sockets.get(id)?.join(roomid),
  );
  return roomid;
};

export const handleOrderCreatedSocket = (
  userid: string,
  chefid: string,
  order: FullOrder,
) => {
  const roomid = joinOrderCreationRoom(userid, chefid);
  io.to(roomid).emit("order:created", { order });
  io.on("order:response", async (order: FullOrder) => {
    if (order.order_status === "DECLINED") {
      // Delete this order from  the database
      await deleteOrder(order.id);
    } else if (order.order_status === "ACCEPTED") {
      return;
    }
  });
};
