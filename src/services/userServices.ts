import buyerRepository from "../repositories/buyerRepository";
import confectionerRepository from "../repositories/confectionerRepository";
import { isCodeValid } from "../shared/utils/hashCode";
import sendCode from "../shared/utils/sendCode";

const getAuth = async (cookies: any) => {
    const userId = cookies?.userId;

    if (!userId) {
        throw new Error("No userId found");
    }

    const user = await buyerRepository.getBuyerById(userId) || 
                await confectionerRepository.getConfectionerById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return await user.getPublicData();
}

const login = async (email: string) => {
    const user = await buyerRepository.getBuyerByParam({ email: email }) ||
                await confectionerRepository.getConfectionerByParam({ email: email });

    if (!user) {
        throw new Error("User not found");
    }

    const { hashedCode } = await sendCode(email);

    user.code = hashedCode;

    await user.save();

    return await user.getPublicData();
}

const code = async (email: string, code: string, setCookie: any) => {
    const user = await buyerRepository.getBuyerByParam({ email: email }) ||
            await confectionerRepository.getConfectionerByParam({ email: email });

    if (!user) {
        throw new Error("User not found");
    }

    const isValid = await isCodeValid(code, user.code || "");

    if (!isValid) {
        throw new Error("Invalid code");
    }

    user.code = undefined;
    await user.save();

    setCookie(user.id);

    return await user.getPublicData();
}

const getUserById = async (id: string) => {
    const user = await buyerRepository.getBuyerById(id) || await confectionerRepository.getConfectionerById(id);

    if (!user) {
        throw new Error("Buyer not found");
    }

    return await user.getPublicData();
}

export default {
    getAuth,
    login,
    code,
    getUserById
}