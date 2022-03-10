import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

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

export const getRequestUserId = (request: Request): number => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return -1;
    const token = authHeader.split(' ')[1];
    return getUserId(token)
}

export const getUserId = (token: string) => {
    const base64Url = token.split('.')[1];
    const data = JSON.parse(Buffer.from(base64Url, 'base64').toString('binary'));
    return data.userId;
}