import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";
import { IMiddlewareAuthRequest } from "../types/authTypes";

export default function (req: IMiddlewareAuthRequest, res: express.Response, next: () => void) {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ msg: "No token auth denied" });
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtToken")) as JwtPayload;
        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
}
