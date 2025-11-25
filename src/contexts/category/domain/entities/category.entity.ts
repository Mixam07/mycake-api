import { UpdateCategoryParams } from "./category.type";

export class Category {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _slug: string,
        private _pastries: string[] = [],
        private readonly _createdAt: Date = new Date(),
        private readonly _updatedAt: Date = new Date(),
    ) {}

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get slug(): string { return this._slug; }
    get pastries(): string[] { return this._pastries; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    public updateCategory(data: UpdateCategoryParams) {
        this._name = data.name;
        this._slug = data.slug
    }

    public addPastryId(pastryId: string) {
        if (this._pastries.includes(pastryId)) {
            return;
        }

        this._pastries = [
            ...this._pastries,
            pastryId
        ]
    }

    public removePastryId(pastryId: string) {
        this._pastries = this._pastries.filter(id => id !== pastryId);
    }
}