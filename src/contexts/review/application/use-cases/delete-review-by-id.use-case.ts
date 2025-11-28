import { Review } from "../../domain/entities/review.entity";
import { IReviewRepository } from "../../domain/repositories/i-review.repository";

export class DeleteReviewByIdUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(categoryId: string): Promise<Review | null> {
        const category = await this.reviewRepository.findById(categoryId);

        if (!category) {
            return null;
        }

        await this.reviewRepository.deleteById(categoryId)

        return category;
    }
}