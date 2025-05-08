import nodemailer from 'nodemailer';
import { hashText } from './hashCode';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'max.mixam07.max@gmail.com',
        pass: 'avar oprd ylnq pnuc'
    }
});

const sendCode = async (email: string) => {
    const random8DigitNumber = Math.floor(10000000 + Math.random() * 90000000);
    const hashedCode = await hashText(random8DigitNumber.toString());

    const mailOptions = {
        to: email,
        subject: "Code",
        text: random8DigitNumber.toString()
    };

    await transporter.sendMail(mailOptions);

    return {
        hashedCode
    };
}

export default sendCode;