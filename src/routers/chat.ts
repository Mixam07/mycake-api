import express, { Request, Response } from "express";
import Chat from "../models/chat";
import mongoose from "mongoose";
import Buyer from "../models/buyer";

const router = express.Router();

router.get("/chats/:userId", async (req: Request, res: Response) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
  
    const chats = await Chat.find({ "participants.user": userId }).populate("participants.user");
  
    res.send(chats);
});

router.post("/chats/:userId", async (req: Request, res: Response): Promise<any> => {
    try {
        const receiverId = req.params.userId;
        const senderId = req.cookies.userId;
        const { text } = req.body;

        if (!senderId) {
            return res.status(401).send({ error: "User not authenticated" });
        }

        type ModelType = "buyer" | "confectioner";

        // Визначаємо модель відправника
        let senderModel: ModelType = "buyer";  // Початково "buyer"
        const sender = await Buyer.findById(senderId);
        if (!sender) senderModel = "confectioner";  // Якщо не знайдено відправника, вважаємо його кондитером

        // Визначаємо модель отримувача
        let receiverModel: ModelType = "buyer";  // Початково "buyer"
        const receiver = await Buyer.findById(receiverId);
        if (!receiver) receiverModel = "confectioner";

        // Шукаємо або створюємо чат
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

        // Додаємо повідомлення
        chat.messages.push({
            sender: {
                user: senderId,
                userModel: senderModel
            },
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