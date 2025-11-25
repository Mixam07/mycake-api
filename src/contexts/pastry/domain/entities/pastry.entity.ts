export class Pastry {
    constructor(
        private readonly _id: string,
        private _categoryId: string | undefined,
        private _categoryName: string | undefined,
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
        private readonly _confectionerId: string,
        private readonly _createdAt: Date = new Date(),
        private readonly _updatedAt: Date = new Date(),
    ) {}

    get id(): string { return this._id; }
    get categoryId(): string | undefined { return this._categoryId; }
    get categoryName(): string | undefined { return this._categoryName; }
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
    get confectionerId(): string { return this._confectionerId; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
}