import app from "../app"
import supertest from "supertest";
import { db } from '../config/index'

const request = supertest(app)


beforeAll(async () => {
    await db.sync().then(() => {
        console.log('Database Connected sucessfully')
    })
})

describe("Test user api", () => {
    it("Create an account", async () => {
        //Arrange and  Act
        const response = await request.post('/users/signup').send({
            email: "test@gmail.com",
            phone: "+2347031313872",
            password: "12345678",
            confirm_password: "12345678"
        })

        expect(response.status).toBe(201)
        expect(response.body.message).toBe("User created successfully check your email or phone for OTP verification")
        expect(response.body).toHaveProperty("signature")



    })
})