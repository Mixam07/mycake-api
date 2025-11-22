export class Auth {
    constructor(
        private readonly _id: string,
        private _email: string,
        private _passwordHash: string,
    ) {}

    get id(): string { return this._id; }
    get email(): string { return this._email; }
    get passwordHash(): string { return this._passwordHash; }
}