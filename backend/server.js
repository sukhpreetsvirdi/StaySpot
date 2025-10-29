import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Connect MySQL
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to Clever Cloud MySQL database!");
  }
});

export default connection;


db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// ✅ Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Route: Get all listings
app.get("/api/listings", (req, res) => {
  db.query("SELECT * FROM listings ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ Route: Add new listing
app.post("/api/listings", upload.single("image"), (req, res) => {
  const { title, description, price, address, property_type, furnished, contact } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO listings 
    (title, description, price, address, property_type, furnished, contact, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [title, description, price, address, property_type, furnished, contact, image_url], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "✅ Listing added successfully!", id: result.insertId });
  });
});

// ✅ Auth Routes
app.use("/api/auth", authRoutes);



// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Start server
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
