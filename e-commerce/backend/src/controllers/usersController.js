const Users = require('../models/Users')

exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Users.getUsuarios();

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
}