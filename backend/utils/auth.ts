import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserJwtData } from "../types";

export const validateToken = (token: string): boolean => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    }
    catch(exception: any){
        console.log(exception)
        return false
    }
}

export const authenticateToken = (request: Request, response: Response, next: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return response.sendStatus(401);

    const token = authHeader.split(' ')[1]
    const isValid = validateToken(token);

    if (isValid) return next();
    return response.sendStatus(401);
}


export const skipAuth =  (request: Request, response: Response, next: any) => {
    return next()
}


export const getUser = (token: string): UserJwtData => {
    const base64Url = token.split('.')[1];
    console.log(base64Url)
    const data = JSON.parse(Buffer.from(base64Url, 'base64').toString('binary'));
    return data;
}


export const getRequestUser = (request: Request): UserJwtData => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    return getUser(token);
}