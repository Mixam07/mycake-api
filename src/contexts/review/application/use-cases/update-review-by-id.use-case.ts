import { Review } from "../../domain/entities/review.entity";
import { IReviewRepository } from "../../domain/repositories/i-review.repository";
import { UpdateReviewDto } from "../../presentation/dtos/review.dto";

export class UpdateReviewByIdUseCase {
    constructor(private readonly reviewRepository: IReviewRepository) {}

    async execute(reviewId: string, dto: UpdateReviewDto): Promise<Review | null> {
        const review = await this.reviewRepository.findById(reviewId);

        if (!review) {
            return null
        }

        review.updateReview(dto);

        await this.reviewRepository.save(review);
        
        return review;
    }
}