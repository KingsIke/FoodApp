"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.loginSchema = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('confirm password').messages({ 'any.only': '{{#label}} does not match' })
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRECT, { expiresIn: "1d" });
};
exports.GenerateSignature = GenerateSignature;
const verifySignature = (signature) => {
    return jsonwebtoken_1.default.verify(signature, config_1.APP_SECRECT);
};
exports.verifySignature = verifySignature;
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return await (0, exports.GeneratePassword)(enteredPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
