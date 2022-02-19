"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDbConnection = exports.getUserByUsername = exports.insertUser = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default('../db');
const insertUser = (user) => {
    db.prepare(`INSERT INTO user(username, password, salt, iterations) VALUES(?, ?, ?, ?)`)
        .run([user.username, user.password, user.salt, user.iterations]);
};
exports.insertUser = insertUser;
const getUserByUsername = (username) => {
    const user = db.prepare(`SELECT * FROM user WHERE username = ?`)
        .get([username]);
    return user;
};
exports.getUserByUsername = getUserByUsername;
const closeDbConnection = () => {
    db.close();
};
exports.closeDbConnection = closeDbConnection;
//# sourceMappingURL=user.js.map