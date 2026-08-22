import pool from "../src/db";

describe("Database Connection", () => {
    afterAll(async () => {
        await pool.end();
    });

    test("should connect to MySQL database", async () => {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");

        expect(rows).toBeDefined();
    });
});