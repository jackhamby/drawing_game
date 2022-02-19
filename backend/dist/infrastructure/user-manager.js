"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.loginUser = exports.createUser = void 0;
const crypto_1 = require("crypto");
const user_1 = require("../data-access/user");
const jwt = __importStar(require("jsonwebtoken"));
const createUser = (user) => {
    const salt = (0, crypto_1.randomBytes)(128).toString('base64');
    const iterations = 10000;
    const hash = (0, crypto_1.pbkdf2Sync)(user.password, salt, iterations, 64, 'sha512');
    const password = hash.toString("hex");
    const newUser = {
        salt,
        iterations,
        password,
        username: user.username,
        user_id: undefined,
    };
    return (0, user_1.insertUser)(newUser);
};
exports.createUser = createUser;
const loginUser = (loginCredentials) => {
    const user = (0, user_1.getUserByUsername)(loginCredentials.username);
    if (!user)
        return null;
    const hashedPassword = (0, crypto_1.pbkdf2Sync)(loginCredentials.password, user.salt, user.iterations, 64, 'sha512');
    if (hashedPassword.toString("hex") === user.password) {
        const userData = {
            username: user.username,
        };
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '160000s' });
        return {
            accessToken: token,
        };
    }
    else {
        return null;
    }
};
exports.loginUser = loginUser;
const validateToken = (token) => {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return true;
    }
    catch (exception) {
        console.log(exception);
        return false;
    }
};
exports.validateToken = validateToken;
//# sourceMappingURL=user-manager.js.map