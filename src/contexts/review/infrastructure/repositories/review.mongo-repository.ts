import { Review } from "../../domain/entities/review.entity";
import { IReviewRepository, PaginatedReviews } from "../../domain/repositories/i-review.repository";
import { ReviewMapper } from "../mongo/review.mapper";
import { ReviewModel } from "../mongo/review.schema";

export class ReviewMongoRepository implements IReviewRepository {
    async save(review: Review): Promise<void> {
        const rawData = ReviewMapper.toPersistence(review);
        await ReviewModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }

    async find(page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            ReviewModel.find()
                .skip(skip)
                .limit(limit)
                .populate('seller')
                .populate('pastry')
                .populate('user')
                .exec(),
            ReviewModel.countDocuments().exec()
        ]);

        return {
            reviews: docs.map(doc => ReviewMapper.toDomain(doc)),
            total: total
        };
    }

    async findById(reviewId: string): Promise<Review | null> {
        const doc = await ReviewModel.findById(reviewId)
            .populate('seller')
            .populate('pastry')
            .populate('user')
            .exec();
        return doc ? ReviewMapper.toDomain(doc) : null;
    }

    async findBySellerId(sellerId: string, page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            ReviewModel.find({ sellerId: sellerId })
                .skip(skip)
                .limit(limit)
                .populate('seller')
                .populate('pastry')
                .populate('user')
                .exec(),
            ReviewModel.countDocuments().exec()
        ]);

        return {
            reviews: docs.map(doc => ReviewMapper.toDomain(doc)),
            total: total
        };
    }

    async findByPastryId(pastryId: string, page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            ReviewModel.find({ pastryId: pastryId })
                .skip(skip)
                .limit(limit)
                .populate('seller')
                .populate('pastry')
                .populate('user')
                .exec(),
            ReviewModel.countDocuments().exec()
        ]);

        return {
            reviews: docs.map(doc => ReviewMapper.toDomain(doc)),
            total: total
        };
    }

    async deleteById(reviewId: string): Promise<Review | null> {
        const doc = await ReviewModel.findByIdAndDelete(reviewId)
            .populate('seller')
            .populate('pastry')
            .populate('user')
            .exec();
        return doc ? ReviewMapper.toDomain(doc) : null;
    }
}