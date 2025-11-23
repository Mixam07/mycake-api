export type UserRole = 'Buyer' | 'Seller';

export interface ISellerProfile {
    description?: string;
    address?: string;
    phone?: string;
    deliveryInfo?: string;
    paymentInfo?: string;
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        youtube?: string;
    };
}

export class User {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _email: string,
        private _role: UserRole,
        private _avatarUrl?: string,
        private _sellerProfile?: ISellerProfile
    ) {}

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get email(): string { return this._email; }
    get role(): UserRole { return this._role; }
    get avatarUrl(): string | undefined { return this._avatarUrl; }
    get sellerProfile(): ISellerProfile | undefined { return this._sellerProfile; }

    public changeAvatar(url: string) {
        this._avatarUrl = url;
    }

    public updateSellerProfile(data: Partial<ISellerProfile>) {
        if (this._role !== 'Seller') {
            throw new Error('Лише продавці мають профіль');
        }

        this._sellerProfile = { ...this._sellerProfile, ...data };
    }
}