import mongoose from "mongoose";
import Buyer from "../models/buyer";
import Chat from "../models/chat";
import chatRepository from "../repositories/chatRepository";
import Confectioner from "../models/confectioner";

const getChats = async (id: string) => {
    const chats = await chatRepository.getChats(id);

    return chats.map((chat: any) => {
        const opponent = chat.participants.find((p: any) => p.user._id.toString() !== id);

        return {
            _id: chat._id,
            opponent: opponent?.user,
            opponentModel: opponent?.userModel,
            messages: chat.messages,
            updatedAt: chat.updatedAt,
        };
    });
};

const sendMessage = async (receiverId: string, senderId: string, text: string) => {
    if (!senderId || !receiverId) {
        throw new Error("User not authenticated")
    }

    type ModelType = "buyer" | "confectioner";

    let senderModel: ModelType = "buyer";
    let sender = await Buyer.findById(senderId);
    if (!sender) {
        sender = await Confectioner.findById(senderId);
        senderModel = "confectioner";
    }

    let receiverModel: ModelType = "buyer";
    let receiver = await Buyer.findById(receiverId);
    if (!receiver) {
        receiver = await Confectioner.findById(receiverId);
        receiverModel = "confectioner";
    }

    if (!sender || !receiver) {
        throw new Error("User not authenticated")
    }

    let chat = await Chat.findOne({
        "participants.user": {
            $all: [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(receiverId)]
        }
    });

    if (!chat) {
        chat = new Chat({
            participants: [
                { user: senderId, userModel: senderModel },
                { user: receiverId, userModel: receiverModel }
            ],
            messages: []
        });
    }

    const userName = sender ? sender.name: "";

    chat.messages.push({
        user: userName,
        text,
        createdAt: new Date()
    });

    await chat.save();

    return {
        text,
        user: userName
    }
}

export default {
    getChats,
    sendMessage
}