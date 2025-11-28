import { Review } from "../../domain/entities/review.entity";
import { IReviewRepository } from "../../domain/repositories/i-review.repository";

export class GetReviewByIdUseCase {
    constructor(private readonly reviewRepository: IReviewRepository) {}

    async execute(reviewId: string): Promise<Review | null> {
        const review = await this.reviewRepository.findById(reviewId);
        
        return review;
    }
}