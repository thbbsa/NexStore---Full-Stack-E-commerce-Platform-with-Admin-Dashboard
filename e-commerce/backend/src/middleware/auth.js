const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const token = req.cookies.token; // get token from cookie

    if (!token) return res.status(401).json({ message: "Token não encontrado." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
}

module.exports = authMiddleware;
