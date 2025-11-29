import { Review } from "../entities/review.entity";

export interface PaginatedReviews {
    reviews: Review[];
    total: number;
}

export interface IReviewRepository {
    save(review: Review): Promise<void>;
    find(page: number, limit: number): Promise<PaginatedReviews>;
    findById(reviewId: string): Promise<Review | null>;
    findBySellerId(sellerId: string, page: number, limit: number): Promise<PaginatedReviews>;
    findByPastryId(pastryId: string, page: number, limit: number): Promise<PaginatedReviews>;
    deleteById(reviewId: string): Promise<Review | null>
}