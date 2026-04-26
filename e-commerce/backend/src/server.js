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
  origin: "http://localhost:5173",
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
