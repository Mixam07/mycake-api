export type UserRole = 'Buyer' | 'Seller';

export class User {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _email: string,
        private _role: UserRole,
        private _avatarUrl?: string,
        private _sellerProfile?: any
    ) {}

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get email(): string { return this._email; }
    get role(): UserRole { return this._role; }
    get avatarUrl(): string | undefined { return this._avatarUrl; }
    get sellerProfile(): any { return this._sellerProfile; }

    public changeAvatar(url: string) {
        this._avatarUrl = url;
    }
}