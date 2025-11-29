import { IPastryRepository } from "../../../pastry/domain/repositories/i-pastry.repository";
import { IUserRepository } from "../../../user/domain/repositories/i-user.repository";
import { Review } from "../../domain/entities/review.entity";
import { IReviewRepository } from "../../domain/repositories/i-review.repository";

export class DeleteReviewByIdUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
        private readonly pastryRepository: IPastryRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(reviewId: string): Promise<Review | null> {
        const review = await this.reviewRepository.findById(reviewId);

        if (!review) {
            return null;
        }

        const pastry = await this.pastryRepository.findById(review.pastryId);

        if (!pastry) {
            throw new Error('Десерт не знайдено');
        }

        const seller = await this.userRepository.findById(pastry.sellerId);
        
        if (!seller) {
            throw new Error('Користувача не знайдено');
        }

        pastry.removeReviewId(review.id);
        seller.removeReviewId(review.id);

        await this.reviewRepository.deleteById(review.id);
        await this.pastryRepository.save(pastry);
        await this.userRepository.save(seller);

        return review;
    }
}