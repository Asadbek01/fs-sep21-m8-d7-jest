import { app } from '../app.js'
import supertest from "supertest"
import mongoose from "mongoose"

import dotenv from "dotenv"
import { response } from 'express'
dotenv.config()

const request = supertest(app)

describe("Just trying out Jest and making sure it's all good", () => {

    it("should test that true is true", () => {
        expect(true).toBe(true);
    })

    test("that false is not true", () => {
        expect(false).not.toBe(true);
    })
})

describe("Testing the endpoints for our express app", () => {

    beforeAll((done) => {
        mongoose.connect(process.env.MONGO_URL + '/test', { useNewUrlParser: true }, () => {
            console.log("Connected to Mongo")
            done()
        })
    })

    it("should test that the /test endpoint returns a success message", async () => {
        const response = await request.get("/test")

        expect(response.body.message).toBe("Test success!")
    })

    const validProduct = {
        name: "Test Product",
        price: 100
    }

    const invalidProduct = {
        name: "Invalid Product",
    }

    it("should test that the POST /products doesnt work with wrong product data", async () => {
        const response = await request.post("/products").send(invalidProduct)

        expect(response.status).toBe(400)
    })

    let createdProductId
    it("should test that the POST /products actually creates a product", async () => {
        try {
            
            const response = await request.post("/products").send(validProduct)
    
            expect(response.body._id).toBeDefined()
        } catch (error) {
            console.log(error)
        }

        createdProductId = response.body._id
    })
 let id
    it("should test that the GET /products/:id actually returns our product", async () => {
        const response = await request.get(`/products/${createdProductId}`)

        expect(response.body.name).toBe(validProduct.name)
    })
    it("should test that PUT /products/:id update our product", async()=>{
        try {
            const response = await request.get(`/products/${id}`)
            expect(response.body._id).toBeDefined()
            
        } catch (error) {
            console.log(error)
        }
        id = response.body._id
    })
    
    it("should test that the GET /products/:id returns 404 on a non-existent product", async () => {
        const response = await request.get("/products/123456123456123456123456")

        expect(response.status).toBe(404)
    })

    afterAll(done => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(() => {
                done()
            })
    })

})