import { Request, Response } from 'express';
import cakeServices from '../services/cakeServices';

const getCakes = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 100;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const cakes = await cakeServices.getCakes(limit, skip);

        res.status(200).send(cakes);
    } catch (e) {
        res.status(404).send(e);
    }
}

const getCakeById = async (req: Request, res: Response): Promise<any> => {
    try {
        const cake = await cakeServices.getCakeById(req.params.id);

        res.status(200).send(cake);
    } catch (e) {
        res.status(404).send(e);
    }
}

const getPhoto = async (req: Request, res: Response): Promise<any> => {
    try {
        const photoIndex = Number(req.params.id_photo);

        if (isNaN(photoIndex)) {
            return res.status(404).send("Invalid photo index");
        }

        const photo = await cakeServices.getPhoto(req.params.id_cake, photoIndex)

        res.set("Content-Type", "image/jpg");
        res.send(photo);
    } catch (e) {
        res.status(404).send(e);
    }
}

const createCake = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.cookies.userId;
    
        if (!userId) {
            return res.status(401).send({ error: "User not authenticated" });
        }
    
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).send({ error: "Please upload at least one file" });
        }
    
        const cake = await cakeServices.createCake(userId, req.files, req.body.data);
    
        res.status(200).send(cake);
    } catch (e) {
        res.status(404).send(e);
    }
}

const updateCake = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body.data ? JSON.parse(req.body.data) : {};

        const cake = await cakeServices.updateCake(data, req.params.id, req.files);

        res.status(200).send(cake);
    } catch (e) {
        res.status(404).send(e);
    }
}

const deleteCake = async (req: Request, res: Response): Promise<any> => {
    try {
        const cake = cakeServices.deleteCake(req.params.id);

        res.status(200).send(cake);
    } catch (e) {
        res.status(404).send(e);
    }
}

export default {
    getCakes,
    getCakeById,
    getPhoto,
    createCake,
    updateCake,
    deleteCake
}