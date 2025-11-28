import { IReviewRepository, PaginatedReviews } from "../../domain/repositories/i-review.repository";

export class GetReviewsUseCase {
    constructor(private readonly reviewsRepository: IReviewRepository) {}

    async execute(page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const safeLimit = limit > 100 ? 100 : limit;

        const users = await this.reviewsRepository.find(page, safeLimit);

        return users;
    }
}