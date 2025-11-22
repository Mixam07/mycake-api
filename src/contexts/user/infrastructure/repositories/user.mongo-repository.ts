import { IUserRepository, PaginatedUsers } from '../../domain/repositories/i-user.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserModel } from '../mongo/user.schema';
import { UserMapper } from '../mongo/user.mapper';
import { AuthModel } from '../../../auth/infrastructure/mongo/auth.schema';

export class UserMongoRepository implements IUserRepository {
    async save(user: User): Promise<void> {
        const rawData = UserMapper.toPersistence(user);
        await UserModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }

    async find(role?: UserRole, page: number = 1, limit: number = 10): Promise<PaginatedUsers> {
        const filter: any = {};
    
        if (role) {
            filter.role = role;
        }

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            UserModel.find(filter).skip(skip).limit(limit).exec(),
            UserModel.countDocuments(filter).exec()
        ]);

        return {
            users: docs.map(doc => UserMapper.toDomain(doc)),
            total: total
        };
    }

    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email }).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async deleteById(id: string): Promise<User | null> {
        const doc = await UserModel.findByIdAndDelete(id).exec();
        return doc ? UserMapper.toDomain(doc) : null;
    }
}