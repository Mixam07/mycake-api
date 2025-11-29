import { Pastry } from "../../../pastry/domain/entities/pastry.entity";
import { User } from "../../../user/domain/entities/user.entity";
import { UpdateReviewDto } from "../../presentation/dtos/review.dto";

export class Review {
    constructor(
        private readonly _id: string,
        private _text: string,
        private _rating: number,
        private readonly _userId: string,
        private readonly _pastryId: string,
        private readonly _sellerId: string,
        private readonly _user: User | null = null,
        private readonly _pastry: Pastry | null = null,
        private readonly _seller: User | null = null,
        private readonly _createdAt: Date = new Date(),
        private readonly _updatedAt: Date = new Date(),
    ) {}

    get id(): string { return this._id; }
    get text(): string { return this._text; }
    get rating(): number { return this._rating; }
    get userId(): string { return this._userId; }
    get pastryId(): string { return this._pastryId; }
    get sellerId(): string { return this._sellerId; }
    get userName(): string | null { return this._user?.name || null; }
    get pastryName(): string | null { return this._pastry?.name || null; }
    get sellerName(): string | null { return this._seller?.name || null }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    public updateReview(dto: UpdateReviewDto) {
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined) {
                (this as any)[`_${key}`] = value;
            }
        });
    }
}