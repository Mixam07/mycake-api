import { PaginatedUsers } from "../../../user/domain/repositories/i-user.repository";
import { Pastry } from "../../domain/entities/pastry.entity";
import { IPastryRepository, PaginatedPastries } from "../../domain/repositories/i-pastry.repository";
import { PastryMapper } from "../mongo/pastry.mapper";
import { PastryModel } from "../mongo/pastry.schema";

export class PastryMongoRepository implements IPastryRepository {
    async save(pastry: Pastry): Promise<void> {
        const rawData = PastryMapper.toPersistence(pastry);
        await PastryModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }

    async find(page: number = 1, limit: number = 10): Promise<PaginatedPastries> {
        const filter: any = {};

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            PastryModel.find(filter).skip(skip).limit(limit).exec(),
            PastryModel.countDocuments(filter).exec()
        ]);

        return {
            pastries: docs.map(doc => PastryMapper.toDomain(doc)),
            total: total
        };
    }

    async findById(pastryId: string): Promise<Pastry | null> {
        const doc = await PastryModel.findById(pastryId).exec();
        return doc ? PastryMapper.toDomain(doc) : null;
    }

    async deleteById(userId: string): Promise<Pastry | null> {
        const doc = await PastryModel.findByIdAndDelete(userId).exec();
        return doc ? PastryMapper.toDomain(doc) : null;
    }
}