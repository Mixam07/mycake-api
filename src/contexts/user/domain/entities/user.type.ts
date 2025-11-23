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