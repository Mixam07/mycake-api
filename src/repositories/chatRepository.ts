import Chat from "../models/chat";

const getChats = (id: string) => Chat.find({ "participants.user": id }).populate("participants.user");

export default {
    getChats
}