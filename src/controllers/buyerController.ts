import { Request, Response } from 'express';
import buyerServices from '../services/buyerServices';

const getBuyers = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 100;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const buyers = await buyerServices.getBuyers(limit, skip)

        res.status(200).send(buyers);
    } catch (e) {
        res.status(404).send(e);
    }
}

const getPhoto = async (req: Request, res: Response): Promise<any> => {
    try {
        const photo = await buyerServices.getPhoto(req.params.id)

        res.set("Content-Type", "image/jpg");
        res.send(photo);
    } catch (e) {
        res.status(404).send(e);
    }
}

const registration = async (req: Request, res: Response): Promise<any> => {
    try {
        const buyer = await buyerServices.registration(req.body.email, req.body);

        res.status(200).send(buyer);
    } catch (e) {
        res.status(404).send(e);
    }
}

const updateBuyer = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body.data ? JSON.parse(req.body.data) : {};

        const buyer = await buyerServices.updateBuyer(data, req.params.id, req.file);

        res.status(200).send(buyer);
    } catch (e) {
        res.status(404).send(e);
    }
}

const deleteBuyer = async (req: Request, res: Response): Promise<any> => {
    try {
        const buyer = await buyerServices.deleteBuyer(req.params.id);

        res.status(200).send(buyer);
    } catch (e) {
        res.status(404).send(e);
    }
}

export default {
    getBuyers,
    getPhoto,
    registration,
    updateBuyer,
    deleteBuyer
}