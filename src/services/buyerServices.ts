import sharp from "sharp";
import Buyer from "../models/buyer";
import buyerRepository from "../repositories/buyerRepository";
import confectionerRepository from "../repositories/confectionerRepository";
import sendCode from "../shared/utils/sendCode";

const getBuyers = async (limit: number, skip: number) => {
    const buyers = await buyerRepository.getBuyers(limit, skip);

    const response = await Promise.all(buyers.map((buyer: any) => buyer.getPublicData()));

    return response;
}

const getBuyerById = async (id: string) => {
    const buyer = await buyerRepository.getBuyerById(id);

    if (!buyer) {
        throw new Error("Buyer not found");
    }

    return await buyer.getPublicData();
}

const getPhoto = async (id: string) => {
    const buyer = await buyerRepository.getBuyerById(id);;

    if (!buyer || !buyer.photo) {
        throw new Error("No photo available");
    }

    return buyer.photo;
}

const registration = async (email: string, body: object) => {
    const existingUser = await buyerRepository.getBuyerByParam({ email: email }) || 
                      await confectionerRepository.getConfectionerByParam({ email: email });

    if (existingUser) {
        throw new Error("This email is already in use");
    }

    const { hashedCode } = await sendCode(email);

    const buyer = new Buyer({
        ...body,
        code: hashedCode
    });

    await buyer.save();

    return await buyer.getPublicData();
}

const updateBuyer = async (data: any, id: string, file: any) => {
    const allowedUpdates = ["name", "email"];
    const updates = Object.keys(data);
    
    if (!updates.every(update => allowedUpdates.includes(update))) {
        throw new Error("Invalid updates!");
    }

    const buyer = await buyerRepository.getBuyerById(id);
    if (!buyer) {
        throw new Error("User not found");
    }

    updates.forEach(update => {
        if (update in buyer) {
            (buyer as any)[update] = data[update];
        }
    });
    
    if (file) {
        buyer.photo = await sharp(file.buffer).resize({ width: 500, height: 500 }).toBuffer();
    }

    await buyer.save();

    return await buyer.getPublicData();
}

const deleteBuyer = async (id: string) => {
    const buyer = await buyerRepository.getBuyerById(id);

    if (!buyer) {
        throw new Error("User not found");
    }

    await buyer.deleteOne();
    
    return await buyer.getPublicData();
}

export default {
    getBuyers,
    getBuyerById,
    getPhoto,
    registration,
    updateBuyer,
    deleteBuyer
}