import { IUserRepository } from '../../domain/repositories/i-user.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserModel } from '../mongo/user.schema';
import { UserMapper } from '../mongo/user.mapper';

export class UserMongoRepository implements IUserRepository {
    async save(user: User): Promise<void> {
        const rawData = UserMapper.toPersistence(user);
        await UserModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }

    async find(role?: UserRole): Promise<User[] | null> {
        const filter: any = {};
    
        if (role) {
            filter.role = role;
        }

        const docs = await UserModel.find(filter).exec();

        return docs.map(doc => UserMapper.toDomain(doc));
    }

    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email }).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }
}