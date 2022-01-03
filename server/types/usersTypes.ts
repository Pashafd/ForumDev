import express from "express";

export interface IGetMyProfileRequest extends express.Request {
    user: IUserInfo;
}

export interface IDeleteProfileRequest extends express.Request {
    user: IUserInfo;
}

export interface IUserInfo {
    name: string;
    email: string;
    password: string;
    id?: number;
}
