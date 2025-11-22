import { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthModel } from '../mongo/auth.schema';
import { AuthMapper } from '../mongo/auth.mapper';

export class AuthMongoRepository implements IAuthRepository {
    async save(auth: Auth): Promise<void> {
        const rawData = AuthMapper.toPersistence(auth);
        await AuthModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }

    async findByEmail(email: string): Promise<Auth | null> {
        const doc = await AuthModel.findOne({ email }).exec();
        return doc ? AuthMapper.toDomain(doc) : null;
    }

    async deleteById(id: string): Promise<Auth | null> {
        const doc = await AuthModel.findByIdAndDelete(id).exec();
        return doc ? AuthMapper.toDomain(doc) : null;
    }
}