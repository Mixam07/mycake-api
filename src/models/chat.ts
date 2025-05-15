import mongoose, { Document, Schema, Model } from "mongoose";

export interface IChat extends Document {
    participants: {
        user: mongoose.Types.ObjectId;
        userModel: "buyer" | "confectioner";
    }[];
    messages: {
        user: String,
        text: string;
        createdAt: Date;
    }[];
}

const ChatSchema = new Schema<IChat>({
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "participants.userModel"
        },
        userModel: {
            type: String,
            required: true,
            enum: ["buyer", "confectioner"]
        }
    }],
    messages: [{
        user: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;