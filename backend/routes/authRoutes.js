import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2";

const router = express.Router();

// 🧩 MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pa77word",  // your MySQL password
  database: "stayspot"
});

// 🧱 Register Route
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required." });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Error hashing password" });

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hash], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          return res.status(400).json({ message: "Email already exists" });
        return res.status(500).json(err);
      }
      res.json({ message: "✅ Registered successfully!" });
    });
  });
});

// 🔑 Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(401).json({ message: "User not found" });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        "stayspot_secret",
        { expiresIn: "1d" }
      );
      res.json({ message: "✅ Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
    });
  });
});

export default router;
