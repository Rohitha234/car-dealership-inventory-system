import request from "supertest";
import app from "../src/app";

describe("Backend API", () => {
  test("should return API health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Car Dealership API is running"
    });
  });
});