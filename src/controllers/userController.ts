import { Request, Response } from 'express';
import userServices from '../services/userServices';

const getAuth = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await userServices.getAuth(req.cookies);

        res.status(200).send(user);
    } catch (e) {
        res.status(404).send(e);
    }
}

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await userServices.login(req.body.email);

        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
}

const code = async (req: Request, res: Response): Promise<any> => {
    try {
        const setCookie = (userId: string) => {
            res.cookie("userId", userId, { httpOnly: true });
        }

        const user = await userServices.code(req.body.email, req.body.code, setCookie);

        res.status(200).send(user);
    } catch (e) {
        res.status(404).send(e);
    }
}

const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        res.clearCookie("userId", { httpOnly: true });

        res.status(200).send({ message: "Logout successful" });
    } catch (e) {
        res.status(404).send(e);
    }
}

const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await userServices.getUserById(req.params.id);

        res.status(200).send(user);
    } catch (e) {
        res.status(404).send(e);
    }
}

export default {
    getAuth,
    getUserById,
    login,
    code,
    logout
}