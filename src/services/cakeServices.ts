import sharp from "sharp";
import cakeRepository from "../repositories/cakeRepository";
import Cake from "../models/cake";
import confectionerRepository from "../repositories/confectionerRepository";

const getCakes = async (limit: number, skip: number) => {
    const cakes = await cakeRepository.getCakes(limit, skip);

    const response = await Promise.all(cakes.map((cake: any) => cake.getPublicData()));

    return response;
}

const getCakeById = async (id: string) => {
    const cake = await cakeRepository.getCakeById(id);

    if (!cake) {
        throw new Error("Cake not found");
    }

    const cakeData = await cake.getPublicData();

    const user = await cake.confectioner.getPublicData();

    return {
        ...cakeData,
        user: user,
    }
}

const getPhoto = async (id_cake: string, id_photo: number) => {
    const cake = await cakeRepository.getCakeById(id_cake);

    if (!cake) {
        throw new Error("Cake not found");
    }

    const photo = cake.photos?.[id_photo];

    if (!photo) {
        throw new Error("Photo not found");
    }

    return photo
}

const createCake = async (userId: string, files: any, values: string) => {
    const processedFiles = await Promise.all(
        (files as Express.Multer.File[]).map(async (file) => {
            const buffer = await sharp(file.buffer).resize({ width: 500, height: 500 }).toBuffer();
            return buffer;
        })
    );

    const data = JSON.parse(values);

    const cake = new Cake({
        ...data,
        photos: processedFiles,
        confectioner: userId,
    });

    await cake.save();

    await confectionerRepository.getConfectionerByIdAndUpdate(userId, { cakes: cake._id });

    return await cake.getPublicData();
}

const updateCake = async (data: any, id: string, files: any) => {
    const updates = Object.keys(data);
    const allowedUpdates = ["name", "description", "status", "price", "tags", "weight", "filling", "additional_services", "min_weight", "max_weight", "category"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        throw new Error("Invalid updates!")
    }

    const cake = await cakeRepository.getCakeById(id);
    if (!cake) {
        throw new Error("Cake not found");
    }

    updates.forEach((update) => {
        (cake as any)[update] = data[update];
    });

    if (files && (files as Express.Multer.File[]).length > 0) {
        const processedFiles = await Promise.all((files as Express.Multer.File[]).map(async (file) => {
            const buffer = await sharp(file.buffer).resize({ width: 500, height: 500 }).toBuffer();
            return buffer;
        }));

        cake.photos = processedFiles;
    }

    await cake.save();

    return await cake.getPublicData();
}

const deleteCake = async (id: string) => {
    const cake = await cakeRepository.getCakeById(id);

    if (!cake) {
        throw new Error("Cake not found");
    }

    await cake.deleteOne();
    
    return await cake.getPublicData();
}

export default {
    getCakes,
    getCakeById,
    getPhoto,
    createCake,
    updateCake,
    deleteCake
}