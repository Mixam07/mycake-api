import { IUserRepository } from '../../domain/repositories/i-user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../mongo/user.schema';
import { UserMapper } from '../mongo/user.mapper';

export class UserMongoRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email }).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async save(user: User): Promise<void> {
        const rawData = UserMapper.toPersistence(user);
        await UserModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }
}