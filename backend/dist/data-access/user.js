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
exports.closeDbConnection = exports.insertUser = void 0;
const sqlite = __importStar(require("sqlite3"));
const db = new sqlite.Database('../db', (error) => {
    if (error) {
        console.error("Failed db connect");
        process.exit(1);
    }
    console.log("opened database connection");
});
const insertUser = (user, callback) => {
    db.run(`INSERT INTO user(username, password, salt, iterations) VALUES(?, ?, ?, ?)`, [user.username, user.password, user.salt, user.iterations], (error) => {
        if (error) {
            console.error(error.message);
            callback(error);
            return;
        }
        callback();
        console.log("succesfully inserted user");
    });
};
exports.insertUser = insertUser;
const closeDbConnection = () => {
    db.close((error) => {
        if (error) {
            console.error(`Failed to close db connection: ${error.message}`);
            return;
        }
        console.log("Closed db connection");
    });
};
exports.closeDbConnection = closeDbConnection;
//# sourceMappingURL=user.js.map