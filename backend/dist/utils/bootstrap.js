"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
const createUserTable = `
    CREATE TABLE user (
        user_id INTEGER PRIMARY KEY,
        username STRING NOT NULL UNIQUE,
        password STRING NOT NULL,
        salt STRING NOT NULL,
        iterations INTEGER NOT NULL
    );
`;
const db = new sqlite3_1.Database('../db', (error) => {
    if (error) {
        console.error("Failed db connect");
        return;
    }
    console.log("opened database connection");
});
db.run(createUserTable, (error) => {
    if (error) {
        console.error("failed to create user table");
        return;
    }
    console.log("created user table");
});
db.close((error) => {
    if (error) {
        console.error("failed to close db connection");
        return;
    }
    console.log("Closed db connection");
});
//# sourceMappingURL=bootstrap.js.map