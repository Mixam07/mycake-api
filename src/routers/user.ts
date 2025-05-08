import express, { Request, Response } from "express";
import Buyer from "../models/buyer";
import Confectioner from "../models/confectioner";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import userController from "../controllers/userController";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'max.mixam07.max@gmail.com',
        pass: 'avar oprd ylnq pnuc'
    }
});

const router = express.Router();

router.get("/getAuth", userController.getAuth);

router.post("/login", userController.login);

router.post("/code", userController.code);

router.post("/logout", userController.logout);

export default router;