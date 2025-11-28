import { Review } from '../../domain/entities/review.entity';

export interface CreateReviewDto {
    text: string,
    rating: number,
    userId: string,
    pastryId: string,
}

export interface UpdateReviewDto {
    text: string;
    rating: string;
}

export class ReviewResponseDTO {
    static fromEntity(review: Review) {
        return {
            id: review.id,
            text: review.text,
            rating: review.rating,
            user: review.userName,
            pastry: review.pastryName,
            confectioner: review.confectionerName,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        };
    }

    static fromEntities(reviews: Review[]) {
        return reviews.map(review => ReviewResponseDTO.fromEntity(review));
    }
}