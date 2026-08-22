import express from "express";
import cors from "cors";
import pool from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Backend is healthy"
    });
});

app.get("/cars", async (req, res) => {
    try {
        const [cars] = await pool.query("SELECT * FROM cars");

        res.status(200).json({
            cars: cars
        });
    } catch (error) {
        console.error("Error fetching cars:", error);

        res.status(500).json({
            message: "Failed to fetch cars"
        });
    }
});

app.get("/cars/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const [cars] = await pool.query(
            "SELECT * FROM cars WHERE id = ?",
            [id]
        );

        if (Array.isArray(cars) && cars.length === 0) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

        res.status(200).json({
            car: cars
        });
    } catch (error) {
        console.error("Error fetching car:", error);

        res.status(500).json({
            message: "Error fetching car"
        });
    }
});
app.post("/cars", async (req, res) => {
    try {
        const { brand, model, year, price, quantity } = req.body;

        // Check missing fields
        if (!brand || !model || !year || !price || quantity === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check invalid values
        if (
            year <= 0 ||
            price <= 0 ||
            quantity < 0
        ) {
            return res.status(400).json({
                message: "Invalid car values"
            });
        }

        const [result]: any = await pool.query(
            `INSERT INTO cars (brand, model, year, price, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [brand, model, year, price, quantity]
        );

        res.status(201).json({
            message: "Car created successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error("Error creating car:", error);

        res.status(500).json({
            message: "Failed to create car"
        });
    }
});
app.put("/cars/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { price, quantity } = req.body;

        if (price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "Price and quantity are required"
            });
        }

        if (price <= 0 || quantity < 0) {
            return res.status(400).json({
                message: "Invalid update values"
            });
        }

        const [result]: any = await pool.query(
            `UPDATE cars
             SET price = ?, quantity = ?
             WHERE id = ?`,
            [price, quantity, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

        res.status(200).json({
            message: "Car updated successfully"
        });

    } catch (error) {
        console.error("Error updating car:", error);

        res.status(500).json({
            message: "Failed to update car"
        });
    }
});
app.delete("/cars/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const [result]: any = await pool.query(
            "DELETE FROM cars WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

        res.status(200).json({
            message: "Car deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting car:", error);

        res.status(500).json({
            message: "Failed to delete car"
        });
    }
});
export default app;