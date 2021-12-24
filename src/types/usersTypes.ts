export interface IUserRegistrationRequest extends IUserInfo {}

export interface IUserInfo {
    name: string;
    email: string;
    password: string;
    id?: number;
}
