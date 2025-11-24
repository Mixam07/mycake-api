import { ISellerProfile, UserRole } from "./user.type";

export class User {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _email: string,
        private _role: UserRole,
        private _avatarUrl?: string,
        private _sellerProfile?: ISellerProfile,
        private _pastries: string[] = [],
        private readonly _createdAt: Date = new Date(),
        private readonly _updatedAt: Date = new Date(),
    ) {}

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get email(): string { return this._email; }
    get role(): UserRole { return this._role; }
    get avatarUrl(): string | undefined { return this._avatarUrl; }
    get sellerProfile(): ISellerProfile | undefined { return this._sellerProfile; }
    get pastries(): string[] { return this._pastries; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    public changeAvatar(url: string) {
        this._avatarUrl = url;
    }

    public updateSellerProfile(data: ISellerProfile) {
        if (this._role !== 'Seller') {
            throw new Error('Лише продавці мають профіль');
        }

        this._sellerProfile = {
            ...(this.sellerProfile || {}),
            ...data
        };
    }

    public addPastryId(pastryId: string) {
        if (this._role !== 'Seller') {
            throw new Error('Покупці не можуть додавати товари');
        }

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