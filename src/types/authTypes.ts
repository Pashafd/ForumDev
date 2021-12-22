import { IUserRegistrationRequest } from "./usersTypes";
import express from "express";

export interface IMiddlewareAuthRequest extends express.Request {
    user: IUserRegistrationRequest;
}

export interface IAuthRequest extends express.Request {
    user: IUserRegistrationRequest;
}
