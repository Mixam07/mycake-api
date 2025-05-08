import mongoose, { Document, Schema, Model } from "mongoose";

interface IConfectioner extends Document {
    name: string;
    email: string;
    photo?: Buffer;
    description?: string;
    address?: string;
    delivery?: string;
    payment?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    code?: string;
    cakes?: [mongoose.Schema.Types.ObjectId];

    getPublicData: () => Promise<Record<string, any>>;
}

const ConfectionerSchema: Schema<IConfectioner> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo: Buffer,
    description: String,
    address: String,
    delivery: String,
    payment: String,
    instagram: String,
    facebook: String,
    youtube: String,
    code: String,
    cakes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cake"
    }]
});

ConfectionerSchema.methods.getPublicData = async function () {
    const confectioner = this;
    const readableValues = ["name", "id", "description", "address", "delivery", "payment", "instagram", "facebook", "youtube", "cakes"];
    const publicConfectionerData: Record<string, any> = {};

    for (const key of readableValues) {
        if (key in confectioner) {
            publicConfectionerData[key] = confectioner[key as keyof IConfectioner];
        }
    }

    if (confectioner.photo) {
        const url = process.env.URL;
        publicConfectionerData.photoURL = `${url}/confectioners/${confectioner._id}/photo`;
    }

    publicConfectionerData.type = "confectioner";
    return publicConfectionerData;
};

const Confectioner: Model<IConfectioner> = mongoose.model<IConfectioner>("confectioner", ConfectionerSchema);

export { IConfectioner };
export default Confectioner;