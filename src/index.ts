import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "./db/mongoose";
import buyersRouter from "./routers/buyer";
import confectionerRouter from "./routers/confectioner";
import userRouter from "./routers/user";
import cakeRouter from "./routers/cake";
import chatRouter from "./routers/chat";
import http from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socket";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
      credentials: true,
    },
});

setupSocketHandlers(io);

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

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

export default app;