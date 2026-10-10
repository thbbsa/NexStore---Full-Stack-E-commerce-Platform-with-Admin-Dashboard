require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routers/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ===================
// MIDDLEWARE GLOBAL
// ===================

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());

// 🔥 JSON ANTES DAS ROTAS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api", authRouter);

// ===================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
