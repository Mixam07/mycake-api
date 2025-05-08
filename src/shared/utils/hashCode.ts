import bcrypt from 'bcrypt';

export const isCodeValid = async (code: string, hashedCode: string) => {
    const isCodeValid = await bcrypt.compare(code, hashedCode);

    return isCodeValid;
}

export const hashText = async (text: string) => {
    const hashedText = await bcrypt.hash(text, 10);

    return hashedText;
}