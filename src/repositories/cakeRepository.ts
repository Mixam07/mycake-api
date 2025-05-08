import Cake from '../models/cake';
import { IConfectioner } from '../models/confectioner';

const getCakes = (limit: number, skip: number) => Cake.find({}).skip(skip).limit(limit);
const getCakeById = (id: string) => Cake.findById(id).populate<{ confectioner: IConfectioner }>("confectioner");

export default {
    getCakes,
    getCakeById
}