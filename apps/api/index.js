"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const PORT = process.env.PORT_NO;
exports.app.listen(PORT, (err) => {
    if (err) {
        console.error("Failed to start server");
    }
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map