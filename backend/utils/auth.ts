import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

const validateToken = (token: string): boolean => {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
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
