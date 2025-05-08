import Buyer from "../models/buyer";

const getBuyers = (limit: number, skip: number) => Buyer.find({}).skip(skip).limit(limit);
const getBuyerById = (id: string) => Buyer.findById(id);
const getBuyerByParam = (param: object) => Buyer.findOne(param);

export default {
    getBuyers,
    getBuyerById,
    getBuyerByParam
}