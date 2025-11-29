import { Pastry } from "../../domain/entities/pastry.entity";
import { IPastryRepository, PaginatedPastries } from "../../domain/repositories/i-pastry.repository";
import { PastryMapper } from "../mongo/pastry.mapper";
import { PastryModel } from "../mongo/pastry.schema";

export class PastryMongoRepository implements IPastryRepository {
    async save(pastry: Pastry): Promise<void> {
        const rawData = PastryMapper.toPersistence(pastry);
        await PastryModel.updateOne({ _id: rawData._id }, rawData, { upsert: true }).populate('category');
    }

    async find(page: number = 1, limit: number = 10): Promise<PaginatedPastries> {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            PastryModel.find()
                .populate('category')
                .populate('seller')
                .skip(skip)
                .limit(limit)
                .exec(),
            PastryModel.countDocuments().exec()
        ]);

        return {
            pastries: docs.map(doc => PastryMapper.toDomain(doc)),
            total: total
        };
    }

    async findById(pastryId: string): Promise<Pastry | null> {
        const doc = await PastryModel.findById(pastryId)
            .populate('category')
            .populate('seller')
            .exec();
        return doc ? PastryMapper.toDomain(doc) : null;
    }

    async findBySellerId(sellerId: string): Promise<Pastry[]> {
        const docs = await PastryModel.find({ sellerId: sellerId })
            .populate('category')
            .populate('seller')
            .exec();
        return docs.map(doc => PastryMapper.toDomain(doc));
    }

    async findByCategoryId(categoryId: string): Promise<Pastry[]> {
        const docs = await PastryModel.find({ categoryId: categoryId })
            .populate('category')
            .populate('seller')
            .exec();
        return docs.map(doc => PastryMapper.toDomain(doc));
    }

    async deleteById(userId: string): Promise<Pastry | null> {
        const doc = await PastryModel.findByIdAndDelete(userId)
            .populate('category')
            .populate('seller')
            .exec();
        return doc ? PastryMapper.toDomain(doc) : null;
    }
}