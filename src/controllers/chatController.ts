import { Request, Response } from 'express';
import chatServices from '../services/chatServices';

const getChats = async (req: Request, res: Response) => {
    try{
        const chats = await chatServices.getChats(req.cookies.userId);
  
        res.send(chats);
    } catch (e) {
        res.status(404).send(e);
    }
}


export default {
    getChats
}