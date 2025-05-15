import { Request, Response } from 'express';
import confectionerServices from '../services/confectionerServices';

const getConfectioners = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? +req.query.limit : 10;
        const skip = req.query.skip ? +req.query.skip : 0;

        const confectioners = confectionerServices.getConfectioners(limit, skip);

        res.status(200).send(confectioners);
    } catch (e) {
        res.status(404).send(e);
    }
}

const getPhoto = async (req: Request, res: Response) => {
    try {
        const photo = await confectionerServices.getPhoto(req.params.id);

        res.set("Content-Type", "image/jpg");
        res.send(photo);
    } catch (e) {
        res.status(404).send(e);
    }
}

const registration = async (req: Request, res: Response): Promise<any> => {
    try {
        const confectioner = await confectionerServices.registration(req.body.email, req.body);

        res.status(200).send(confectioner);
    } catch (e) {
        res.status(404).send(e);
    }
}

const updateConfectioner = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body.data ? JSON.parse(req.body.data) : {};
        
        const confectioner = await confectionerServices.updateConfectioner(data, req.params.id, req.file);

        res.status(200).send(confectioner);
    } catch (e) {
        res.status(404).send(e);
    }
}

const deleteConfectioner = async (req: Request, res: Response) => {
    try {
        const confectioner = await confectionerServices.deleteConfectioner(req.params.id);

        res.status(200).send(confectioner);
    } catch (e) {
        res.status(404).send(e);
    }
}

export default {
    getConfectioners,
    getPhoto,
    registration,
    updateConfectioner,
    deleteConfectioner
}