const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.connect()
  .then((client) => {
    console.log("PostgreSQL connected successfully!");
    client.release();
  })
  .catch((error) => {
    console.error("PostgreSQL connection error:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Student Management System Backend is Running");
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Add a student
app.post("/api/students", async (req, res) => {
  try {
    const { student_id, name, department, semester, email } = req.body;

    const result = await pool.query(
      `INSERT INTO students
       (student_id, name, department, semester, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [student_id, name, department, semester, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "Student ID already exists"
      });
    }

    res.status(500).json({
      error: "Failed to add student"
    });
  }
});

// Delete a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully",
      student: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete student"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});