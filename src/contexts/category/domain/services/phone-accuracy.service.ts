import { isValidPhoneNumber } from 'libphonenumber-js';

export class PhoneAccuracyService {
    public isCorrect(phone: string): boolean {
        if (!isValidPhoneNumber(phone, 'UA')) return false;
        return true;
    }
}