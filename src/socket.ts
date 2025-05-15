import { Server, Socket } from "socket.io";;
import chatServices from "./services/chatServices";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
      console.log("🔌 New client connected:", socket.id);

      socket.on("send_message", async (data) => {
          const { text, user } = await chatServices.sendMessage(data.receiverId, data.senderId, data.text);

          io.emit("receive_message", { text, user });
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
      });
  });
};