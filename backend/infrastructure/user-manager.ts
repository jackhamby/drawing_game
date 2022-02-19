import { pbkdf2Sync, randomBytes } from "crypto";
import { getUserByUsername, insertUser } from "../data-access/user";
import { CreateUser, Login, LoginResponse, User } from "../types";
import * as jwt from "jsonwebtoken";

export const createUser = (user: CreateUser) => {
    const salt = randomBytes(128).toString('base64');
    const iterations = 10000;
    const hash =  pbkdf2Sync(user.password, salt, iterations, 64, 'sha512');
    const password = hash.toString("hex");
    const newUser: User = {
        salt,
        iterations,
        password,
        username: user.username,
        user_id: undefined,
    }

    return insertUser(newUser);
}


export const loginUser = (loginCredentials: Login): LoginResponse => {
    const user = getUserByUsername(loginCredentials.username);

    if (!user) return null;

    const hashedPassword = pbkdf2Sync(loginCredentials.password, user.salt, user.iterations, 64, 'sha512');

    if (hashedPassword.toString("hex") === user.password){
        const userData = {
            username: user.username,
        }

        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '360s' });

        return {
            accessToken: token,
        };
    }
    else {
        return null;
    }
}