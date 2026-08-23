// Import dotenv to load environment variables from the .env file
import dotenv from "dotenv";

// Import the configured Express application
import app from "./app";

// Load environment variables before starting the server
dotenv.config();

// Use the configured port or default to port 3000
const PORT = process.env.PORT || 3000;

// Start the Express server and confirm that it is running
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});