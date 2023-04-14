import { User } from "../types";
import Database from 'better-sqlite3';

const db = new Database('../db')

export const insertUser = (user: User): void => {
    db.prepare(`INSERT INTO user(username, password, salt, iterations) VALUES(?, ?, ?, ?)`)
      .run([user.username, user.password, user.salt, user.iterations]);
}

export const getUserByUsername = (username: string): User => {
    const user = db.prepare<any>(`SELECT * FROM user WHERE username = ?`)
                   .get([username]) as User;
    console.log(user)
    return user;
}

export const closeDbConnection = () => {
    db.close();
}