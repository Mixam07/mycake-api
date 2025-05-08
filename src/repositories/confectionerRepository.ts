import Confectioner from "../models/confectioner";

const getConfectioners = (limit: number, skip: number) => Confectioner.find({}).skip(skip).limit(limit);
const getConfectionerById = (id: string) => Confectioner.findById(id);
const getConfectionerByIdAndUpdate = (userId: string, data: object) => Confectioner.findByIdAndUpdate(userId, { $push: data });
const getConfectionerByParam = (param: object) => Confectioner.findOne(param);

export default {
    getConfectioners,
    getConfectionerById,
    getConfectionerByIdAndUpdate,
    getConfectionerByParam
}