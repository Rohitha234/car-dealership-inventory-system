import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import pool from "./db";
import authenticateToken from "./authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Backend is healthy"
  });
});


/* =========================
   USER AUTHENTICATION
========================= */

// REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check if user already exists
    const [existingUsers]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const [result]: any = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId
    });

  } catch (error) {
    console.error("Error registering user:", error);

    res.status(500).json({
      message: "Failed to register user"
    });
  }
});


/* =========================
   LOGIN USER
========================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check missing fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const [users]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed"
    });
  }
});


/* =========================
   CAR APIs
========================= */

// GET ALL CARS
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


// GET CAR BY ID
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


// ADD CAR — PROTECTED WITH JWT
app.post("/cars", authenticateToken, async (req, res) => {
  try {
    const { brand, model, year, price, quantity } = req.body;

    // Check missing fields
    if (!brand || !model || !year || !price || quantity === undefined) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check invalid values
    if (year <= 0 || price <= 0 || quantity < 0) {
      return res.status(400).json({
        message: "Invalid car values"
      });
    }

    // Insert car into database
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


// UPDATE CAR — PROTECTED WITH JWT
app.put("/cars/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    const { brand, model, year, price, quantity } = req.body;

    // Check missing fields
    if (
      !brand ||
      !model ||
      year === undefined ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check invalid values
    if (year <= 0 || price <= 0 || quantity < 0) {
      return res.status(400).json({
        message: "Invalid update values"
      });
    }

    // Update car
    const [result]: any = await pool.query(
      `UPDATE cars
       SET brand = ?, model = ?, year = ?, price = ?, quantity = ?
       WHERE id = ?`,
      [brand, model, year, price, quantity, id]
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


// DELETE CAR — PROTECTED WITH JWT
app.delete("/cars/:id", authenticateToken, async (req, res) => {
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