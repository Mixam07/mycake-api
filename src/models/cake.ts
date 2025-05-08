import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICake extends Document {
    name: string;
    description: string;
    status: boolean;
    price: number;
    tags: string[];
    weight: number;
    filling: string[];
    additional_services: string[];
    min_weight: number;
    max_weight: number;
    photos: Buffer[];
    confectioner: mongoose.Schema.Types.ObjectId;

    getShortPublicData(): Promise<any>;
    getPublicData(): Promise<any>;
}

const cakeSchema = new Schema<ICake>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value < 0 || value > 100000) {
                throw new Error("Price must be a positive number and not exceed 100000");
            }
        },
    },
    tags: {
        type: [String],
        default: [],
    },
    weight: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value < 0 || value > 1000) {
                throw new Error("Weight must be a positive number and not exceed 1000 kg");
            }
        },
    },
    filling: {
        type: [String],
        required: true,
    },
    additional_services: {
        type: [String],
        required: true,
    },
    min_weight: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value < 0 || value > 1000) {
                throw new Error("Min weight must be a positive number and not exceed 1000 kg");
            }
        },
    },
    max_weight: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value < 0 || value > 1000) {
                throw new Error("Max weight must be a positive number and not exceed 1000 kg");
            }
        },
    },
    photos: {
        type: [Buffer],
        required: true,
    },
    confectioner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "confectioner"
    }
});

cakeSchema.methods.getShortPublicData = async function () {
    const cake = this as ICake;

    const readableValues = [
        "name",
        "price",
        "id",
    ];

    const publicCakeData: any = {};

    readableValues.forEach((key) => {
        // @ts-ignore
        publicCakeData[key] = cake[key];
    });

    publicCakeData.photosURL = cake.photos.map((_, i) => {
        const url = process.env.URL || "http://localhost:3000";
        return `${url}/cakes/${cake._id}/photos/${i}`;
    });

    return publicCakeData;
};

cakeSchema.methods.getPublicData = async function () {
    const cake = this as ICake;

    const readableValues = [
        "name",
        "description",
        "status",
        "price",
        "tags",
        "weight",
        "filling",
        "additional_services",
        "min_weight",
        "max_weight",
        "id"
    ];

    const publicCakeData: any = {};

    readableValues.forEach((key) => {
        // @ts-ignore
        publicCakeData[key] = cake[key];
    });

    publicCakeData.photosURL = cake.photos.map((_, i) => {
        const url = process.env.URL || "http://localhost:3000";
        return `${url}/cakes/${cake._id}/photos/${i}`;
    });

    return publicCakeData;
};

const Cake: Model<ICake> = mongoose.model<ICake>("Cake", cakeSchema);

export default Cake;