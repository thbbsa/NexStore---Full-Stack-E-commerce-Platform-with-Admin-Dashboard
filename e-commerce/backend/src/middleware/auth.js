const jwt = require("jsonwebtoken");
const SECRET_KEY = "48d321f254bb19fe1ffe7cba980b77fcba0f582bbcd1082415723d17ba35d6165198af9f7de15769a018f2c0276d5f8200dc1147ba9aebfed0599c24dcf2e5d2";

function authMiddleware(req, res, next) {
    const token = req.cookies.token; // 👈 get token from cookie

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
