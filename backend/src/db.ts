// Import the MySQL promise-based library for asynchronous database operations
import mysql from "mysql2/promise";

// Import dotenv to load database configuration from environment variables
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Create a reusable MySQL connection pool for the application
const pool = mysql.createPool({
  // Database server host
  host: process.env.DB_HOST,

  // Database username
  user: process.env.DB_USER,

  // Database password
  password: process.env.DB_PASSWORD,

  // Name of the database to connect to
  database: process.env.DB_NAME,

  // Database port, using 3306 as the default MySQL port
  port: Number(process.env.DB_PORT) || 3306
});

// Export the connection pool for use in other application files
export default pool;