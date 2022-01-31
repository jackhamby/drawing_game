"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const crypto_1 = require("crypto");
const user_1 = require("../data-access/user");
const createUser = (user, callback) => {
    const salt = (0, crypto_1.randomBytes)(128).toString('base64');
    const iterations = 10000;
    (0, crypto_1.pbkdf2)(user.password, salt, iterations, 64, 'sha512', (error, hash) => {
        if (error) {
            console.error(`Failed to create password has: ${error.message}`);
            return;
        }
        console.log(`hashed password ${hash}`);
        const password = hash.toString("hex");
        const newUser = {
            salt,
            iterations,
            password,
            username: user.username,
            user_id: undefined,
        };
        (0, user_1.insertUser)(newUser, callback);
    });
};
exports.createUser = createUser;
//# sourceMappingURL=user-manager.js.map