import request from "supertest";
import app from "../src/app";
import pool from "../src/db";

describe("Database Connection", () => {
    test("should connect to MySQL database", async () => {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");

        expect(rows).toBeDefined();
    });
});

describe("Cars API", () => {
    test("should return all cars", async () => {
        const response = await request(app).get("/cars");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("cars");
        expect(Array.isArray(response.body.cars)).toBe(true);
    });
});

// This must be at the very end of the file
afterAll(async () => {
    await pool.end();
});

describe("Single Car API", () => {
    test("should return 404 when car is not found", async () => {
    const response = await request(app).get("/cars/9999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
});
    test("should return a car by id", async () => {
        const response = await request(app).get("/cars/1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("car");
    });
});
describe("Create Car API", () => {
    test("should create a new car", async () => {
        const newCar = {
            brand: "Honda",
            model: "Civic",
            year: 2024,
            price: 28000,
            quantity: 3
        };

        const response = await request(app)
            .post("/cars")
            .send(newCar);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Car created successfully");
    });
});
describe("Update Car API", () => {
    test("should update a car", async () => {
        const updatedCar = {
            price: 3500000,
            quantity: 5
        };

        const response = await request(app)
            .put("/cars/1")
            .send(updatedCar);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "message",
            "Car updated successfully"
        );
    });
});
describe("Delete Car API", () => {
    test("should delete a car", async () => {
        const response = await request(app)
            .delete("/cars/1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "message",
            "Car deleted successfully"
        );
    });
});