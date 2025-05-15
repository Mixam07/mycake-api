import express, { Request, Response } from "express";
import Chat from "../models/chat";
import mongoose from "mongoose";
import Buyer from "../models/buyer";
import chatController from "../controllers/chatController";

const router = express.Router();

router.get("/chats", chatController.getChats);

router.post("/chats/:userId", async (req: Request, res: Response): Promise<any> => {
    try {
        const receiverId = req.params.userId;
        const senderId = req.cookies.userId;
        const { text } = req.body;

        if (!senderId) {
            return res.status(401).send({ error: "User not authenticated" });
        }

        type ModelType = "buyer" | "confectioner";

        let senderModel: ModelType = "buyer";
        const sender = await Buyer.findById(senderId);
        if (!sender) senderModel = "confectioner";

        let receiverModel: ModelType = "buyer";
        const receiver = await Buyer.findById(receiverId);
        if (!receiver) receiverModel = "confectioner";

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
        res.status(200).send(chat);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
    }
});

export default router;