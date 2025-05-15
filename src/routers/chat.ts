import express from "express";
import chatController from "../controllers/chatController";

const router = express.Router();

router.get("/chats", chatController.getChats);


export default router;