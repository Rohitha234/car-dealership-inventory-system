import request from "supertest";
import app from "../src/app";
import pool from "../src/db";

let testCarId: number;

describe("Database Connection", () => {
    test("should connect to MySQL database", async () => {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");

        expect(rows).toBeDefined();
    });
});

describe("Cars API", () => {

    beforeAll(async () => {
        const newCar = {
            brand: "Test Brand",
            model: "Test Model",
            year: 2024,
            price: 25000,
            quantity: 5
        };

        const response = await request(app)
            .post("/cars")
            .send(newCar);

        testCarId = response.body.id;
    });

    test("should return all cars", async () => {
        const response = await request(app).get("/cars");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("cars");
        expect(Array.isArray(response.body.cars)).toBe(true);
    });

    test("should return 404 when car is not found", async () => {
        const response = await request(app).get("/cars/9999");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty(
            "message",
            "Car not found"
        );
    });

    test("should return a car by id", async () => {
        const response = await request(app)
            .get(`/cars/${testCarId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("car");
    });

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
        expect(response.body).toHaveProperty(
            "message",
            "Car created successfully"
        );
    });

    test("should update a car", async () => {
        const updatedCar = {
            price: 3500000,
            quantity: 5
        };

        const response = await request(app)
            .put(`/cars/${testCarId}`)
            .send(updatedCar);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "message",
            "Car updated successfully"
        );
    });

  test("should delete a car", async () => {
    const newCar = {
        brand: "Delete Test",
        model: "Test Car",
        year: 2024,
        price: 20000,
        quantity: 2
    };

    const createResponse = await request(app)
        .post("/cars")
        .send(newCar);

    console.log("Created car:", createResponse.body);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty("id");

    const deleteCarId = createResponse.body.id;

    console.log("Deleting car ID:", deleteCarId);

    const [rows]: any = await pool.query(
        "SELECT * FROM cars WHERE id = ?",
        [deleteCarId]
    );

    console.log("Car directly from database:", rows);

    const response = await request(app)
        .delete(`/cars/${deleteCarId}`);

    console.log("Delete response:", response.body);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty(
        "message",
        "Car deleted successfully"
    );
});
    test("should return 400 when required fields are missing", async () => {
        const invalidCar = {
            brand: "Toyota"
        };

        const response = await request(app)
            .post("/cars")
            .send(invalidCar);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "message",
            "All fields are required"
        );
    });
    test("should return 400 for invalid car values", async () => {
    const invalidCar = {
        brand: "Toyota",
        model: "Camry",
        year: -5,
        price: -100,
        quantity: -2
    };

    const response = await request(app)
        .post("/cars")
        .send(invalidCar);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
        "message",
        "Invalid car values"
    );
    });
});
describe("Update Car Validation", () => {
    test("should return 400 for invalid update values", async () => {
        const invalidUpdate = {
            price: -500,
            quantity: -2
        };

        const response = await request(app)
            .put("/cars/1")
            .send(invalidUpdate);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "message",
            "Invalid update values"
        );
    });
});

afterAll(async () => {
    await pool.end();
});