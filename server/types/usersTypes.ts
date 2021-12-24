import express from "express";

export interface IUserRegistrationRequest extends IUserInfo {}

export interface IGetMyProfileRequest extends express.Request {
    user: IUserInfo;
}

export interface IUserInfo {
    name: string;
    email: string;
    password: string;
    id?: number;
}
