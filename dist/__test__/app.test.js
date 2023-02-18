"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../config/index");
const request = (0, supertest_1.default)(app_1.default);
beforeAll(async () => {
    await index_1.db.sync().then(() => {
        console.log('Database Connected sucessfully');
    });
});
describe("Test user api", () => {
    it("Create an account", async () => {
        //Arrange and  Act
        const response = await request.post('/users/signup').send({
            email: "test@gmail.com",
            phone: "+2347031313872",
            password: "12345678",
            confirm_password: "12345678"
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User created successfully check your email or phone for OTP verification");
        expect(response.body).toHaveProperty("signature");
    });
});
