"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const Index = (req, res) => {
    try {
        res.status(200).send(`Welcome to Kings Shop ....`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.Index = Index;
