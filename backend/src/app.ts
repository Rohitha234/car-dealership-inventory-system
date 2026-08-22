import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Car Dealership API is running"
  });
});

export default app;