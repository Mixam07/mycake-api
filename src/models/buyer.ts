import mongoose, { Document, Model, Schema } from "mongoose";

type BuyerDocument = Document & {
    name: string;
    email: string;
    photo?: Buffer;
    code?: string;
    getPublicData: () => Promise<Record<string, any>>;
};

const buyersSchema = new Schema<BuyerDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photo:  Buffer,
    code: String,
});

buyersSchema.methods.getPublicData = async function (): Promise<Record<string, any>> {
    const buyer = this;
    const readableValues = ["name", "email", "id"];
    const publicBuyersData: Record<string, any> = {};

    readableValues.forEach((key) => {
        if (buyer[key as keyof BuyerDocument]) {
            publicBuyersData[key] = buyer[key as keyof BuyerDocument];
        }
    });

    if (buyer.photo) {
        const url = process.env.URL;
        publicBuyersData.photoURL = `${url}/buyers/${buyer._id}/photo`;
    }

    publicBuyersData.type = "buyer";

    return publicBuyersData;
};

const Buyer: Model<BuyerDocument> = mongoose.model<BuyerDocument>("buyer", buyersSchema);

export default Buyer;