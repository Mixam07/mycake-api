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
        private readonly _categoryId: string,
        private readonly _confectionerId: string,
        private readonly _category: Category | null,
        private readonly _confectioner: User | null,
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
    get categoryId(): string { return this._categoryId; }
    get confectionerId(): string { return this._confectionerId }
    get categoryName(): string | null { return this._category?.name || null; }
    get confectionerName(): string | null { return this._confectioner?.name || null; }
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
}