import sharp from "sharp";
import Confectioner from "../models/confectioner";
import buyerRepository from "../repositories/buyerRepository";
import confectionerRepository from "../repositories/confectionerRepository";
import sendCode from "../shared/utils/sendCode";

const getConfectioners = async (limit: number, skip: number) => {
    const confectioners = await confectionerRepository.getConfectioners(limit, skip);

    const response = await Promise.all(confectioners.map((cake: any) => cake.getPublicData()));

    return response;
}

const getPhoto = async (id: string) => {
    const confectioner = await confectionerRepository.getConfectionerById(id);

    if (!confectioner || !confectioner.photo) {
        throw new Error("No photo available");
    }

    return confectioner.photo
}

const registration = async (email: string, body: object) => {
    const existingUser = await buyerRepository.getBuyerByParam({ email: email }) || 
                      await confectionerRepository.getConfectionerByParam({ email: email });

    if (existingUser) {
        throw new Error("This email is already in use");
    }

    const { hashedCode } = await sendCode(email);

    const confectioner = new Confectioner({
        ...body,
        code: hashedCode
    });

    await confectioner.save();

    return await confectioner.getPublicData();
}

const updateConfectioner = async (data: any, id: string, file: any) => {
    const updates = Object.keys(data);
    const allowedUpdates = ["name", "phone", "description", "address", "email", "delivery", "payment", "instagram", "facebook", "youtube"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        throw new Error("Invalid updates!");
    }

    const confectioner = await confectionerRepository.getConfectionerById(id);

    if (!confectioner) {
        throw new Error("User not found")
    }

    updates.forEach(update => {
        if (update in confectioner) {
            (confectioner as any)[update] = data[update];
        }
    });

    if (file) {
        confectioner.photo = await sharp(file.buffer).resize({ width: 500, height: 500 }).toBuffer();
    }

    await confectioner.save();

    return await confectioner.getPublicData();
}

const deleteConfectioner = async (id: string) => {
    const confectioner = await confectionerRepository.getConfectionerById(id);

    if (!confectioner) {
        throw new Error("Confectioner not found");
    }

    await confectioner.deleteOne();

    return await confectioner.getPublicData();
}

export default {
    getConfectioners,
    getPhoto,
    registration,
    updateConfectioner,
    deleteConfectioner
}