import { IUserProfile } from "./profileTypes";
import express from "express";

export interface IRequestWithUser extends express.Request {
    user: IUserProfile;
}
