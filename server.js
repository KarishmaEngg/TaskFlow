const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes"); 

dotenv.config();
const app = express();

// 1. Updated CORS: Sabhi origins allow karne ke liye ya specific frontend link dene ke liye
app.use(cors({
  origin: "*", // Testing ke liye "*" sahi hai, production mein apna Frontend URL dalein
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Basic Route for health check
app.get("/", (req, res) => {
  res.send("TaskFlow API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes); 

// 2. Port Binding: Render automatically PORT assign karta hai
const PORT = process.env.PORT || 10000; 

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.log("DB Connection Error:", err);
    process.exit(1); // Agar DB connect na ho toh process exit karein
  });