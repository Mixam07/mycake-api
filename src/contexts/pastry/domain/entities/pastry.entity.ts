import { Category } from "../../../category/domain/entities/category.entity";
import { User } from "../../../user/domain/entities/user.entity";
import { UpdatePastryDto } from "../../presentation/dtos/pastry.dto";

export class Pastry {
    constructor(
        private readonly _id: string,
        private _status: string,
        private _images: string[],
        private _name: string,
        private _price: number,
        private _description: string,
        private _tags: string[],
        private _weight: number,
        private _fillings: string[],
        private _additionalServices: string[],
        private _minWeight: number,
        private _maxWeight: number,
        private _reviewIds: string[] = [],
        private readonly _categoryId: string,
        private readonly _sellerId: string,
        private readonly _category: Category | null,
        private readonly _seller: User | null,
        private readonly _createdAt: Date = new Date(),
        private readonly _updatedAt: Date = new Date(),
    ) {}

    get id(): string { return this._id; }
    get status(): string { return this._status; }
    get images(): string[] { return this._images; }
    get name(): string { return this._name; }
    get price(): number { return this._price; }
    get description(): string { return this._description; }
    get tags(): string[] { return this._tags; }
    get weight(): number { return this._weight; }
    get fillings(): string[] { return this._fillings; }
    get additionalServices(): string[] { return this._additionalServices; }
    get minWeight(): number { return this._minWeight; }
    get maxWeight(): number { return this._maxWeight; }
    get reviewIds(): string[] { return this._reviewIds; }
    get categoryId(): string { return this._categoryId; }
    get sellerId(): string { return this._sellerId }
    get categoryName(): string | null { return this._category?.name || null; }
    get sellerName(): string | null { return this._seller?.name || null; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    public updatePastry(dto: UpdatePastryDto) {
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined) {
                (this as any)[`_${key}`] = value;
            }
        });
    }

    public addImages(images: string[]) {
        this._images = images;
    }

    public addReviewId(reviewId: string) {
        if (this._reviewIds.includes(reviewId)) {
            return;
        }

        this._reviewIds = [
            ...this._reviewIds,
            reviewId
        ]
    }

    public removeReviewId(reviewId: string) {
        this._reviewIds = this._reviewIds.filter(id => id !== reviewId);
    }
}