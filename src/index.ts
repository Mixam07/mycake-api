import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "./db/mongoose";
import buyersRouter from "./routers/buyer";
import confectionerRouter from "./routers/confectioner";
import userRouter from "./routers/user";
import cakeRouter from "./routers/cake";
import chatRouter from "./routers/chat";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
        callback(null, true);
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(buyersRouter);
app.use(confectionerRouter);
app.use(userRouter);
app.use(cakeRouter);
app.use(chatRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

export default app;