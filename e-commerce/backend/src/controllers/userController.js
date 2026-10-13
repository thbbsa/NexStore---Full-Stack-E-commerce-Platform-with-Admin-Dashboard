const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const SECRET_KEY = process.env.JWT_SECRET;


async function cadastrarUsuario(req, res, adminCriando) {
    const infoUser = { ...req.body };

    if (!adminCriando || !["user", "admin"].includes(infoUser.role)) {
        infoUser.role = "user";
    }

    try {
        const existingUser = await User.findByUsername(infoUser.username);
        const existingEmail = await User.findByEmail(infoUser.email);
        const existingCPF = await User.findByCPF(infoUser.cpf);
        const existingTelefone = await User.findByTelefone(infoUser.telefone);

        if (existingUser) {
            return res.status(400).json({ message: "Username já existe." });
        }

        if (existingEmail) {
            return res.status(400).json({ message: "Email já registrado." });
        }

        if (existingCPF) {
            return res.status(400).json({ message: "CPF já registrado." });
        }

        if (existingTelefone) {
            return res.status(400).json({ message: "Telefone já registrado." });
        }

        const user = await User.create(infoUser);
        res.status(201).json({ message: "Usuário registrado com sucesso!", user });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar usuário.", error });
        console.log(error)
    }
}

exports.register = (req, res) => cadastrarUsuario(req, res, false);
exports.criarUsuario = (req, res) => cadastrarUsuario(req, res, true);

exports.login = async (req, res) => {
    const { email, senha, rememberMe } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ message: "Email ou senha incorretos." });

        const correctPassword = await bcrypt.compare(senha, user.Senha);
        if (!correctPassword) return res.status(400).json({ message: "Email ou senha incorretos." });

        const token = jwt.sign(
            { id: user.Id, username: user.Username, email: user.Email, role: user.Role },
            SECRET_KEY,
            { expiresIn: rememberMe ? "7d" : "1h" }
        );

        if (!user.Ativo) return res.status(403).json({ message: "Conta desativada." });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 7 days or 1h
        });

        return res.status(200).json({ message: "Login realizado com sucesso!", user: { username: user.Username, email: user.Email, role: user.Role } });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro ao fazer login." });
    }
};


exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: "Usuario Encontrado!", user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao buscar usuário." });
    }
}

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id)

        res.status(200).json({ message: "Usuario buscado com sucesso!", user });
    } catch (error) {
        console.log("Erro ao carregar usuario:", error);
        res.status(500).json({ message: "Erro ao carregar usuario." });
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && String(req.user.id) !== String(id)) {
        return res.status(403).json({ message: "Acesso negado." });
    }

    if (!isAdmin) {
        delete updates.role;
        delete updates.ativo;
    }

    try {

        if (updates.Username) {
            const existingUser = await User.findByUsername(updates.Username);
            if (existingUser && existingUser.Id != id) {
                return res.status(400).json({ message: "Username já existe." });
            }
        }

        if (updates.Email) {
            const existingEmail = await User.findByEmail(updates.Email);
            if (existingEmail && existingEmail.Id != id) {
                return res.status(400).json({ message: "Email já registrado." });
            }
        }

        if (updates.Telefone) {
            const existingTelefone = await User.findByTelefone(updates.Telefone);
            if (existingTelefone && existingTelefone.Id != id) {
                return res.status(400).json({ message: "Telefone já registrado." });
            }
        }

        const user = await
            User.update(id, updates);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        res.status(200).json({ message: "Usuário atualizado com sucesso!", user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
}

exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });

    return res.status(200).json({ message: "Logout realizado com sucesso!" });
};

exports.createEndereco = async (req, res) => {
    try {
        const userIdAlvo = (req.user.role === "admin" && req.params.id) ? req.params.id : req.user.id;

        const { logradouro, numero, complemento, bairro, localidade, estado, cep } = req.body;


        const endereco = await User.getEndereco(userIdAlvo);

        if (endereco.length >= 5) {
            return res.status(400).json({ message: "Limite de endereços atingido. Exclua um endereço para adicionar outro." });
        }

        await User.createEndereco(userIdAlvo, logradouro, numero, complemento, bairro, localidade, estado, cep);

        res.status(200).json({ message: "Endereço criado com sucesso!" });
    } catch (error) {
        console.log("Erro ao criar endereço:", error);
        res.status(500).json({ message: "Erro ao criar endereço." });
    }
}

// No seu arquivo de rotas/controllers
exports.getEndereco = async (req, res) => {
    try {
        const userId = req.user.id;

        const endereco = await User.getEndereco(userId);

        if (!endereco) {
            return res.status(404).json({ message: "Endereço não encontrado" });
        }

        res.status(200).json(endereco);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar endereço" });
    }
}

exports.getEnderecosByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const enderecos = await User.getEndereco(id);

        res.status(200).json({ message: "Endereços buscado com sucesso.", enderecos });
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar endereço" });
    }
}

exports.updateEndereco = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const { Principal } = updates;

    if (req.user.role !== "admin" && !(await User.enderecoPertenceAoUsuario(id, req.user.id))) {
        return res.status(404).json({ message: "Endereço não encontrado." });
    }

    try {
        if (Principal !== undefined) {
            const endereco = await User.becomePrincipal(id);

            return res.status(200).json({ message: "Endereço setado como principal", endereco });
        }

        const endereco = await User.updateEndereco(id, updates);

        if (!endereco) {
            return res.status(404).json({ message: "Endereço não encontrado." });
        }

        res.status(200).json({ message: "Endereço atualizado com sucesso!" });

    } catch (error) {
        console.log("Erro ao atualizar endereço:", error);
        res.status(500).json({ message: "Erro ao atualizar endereço." });
    }

}

exports.excluirUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        await User.anonimizar(id);

        res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
        console.log("Erro ao excluir usuário:", error);
        res.status(500).json({ message: "Erro ao excluir usuário." });
    }
};

exports.deletarEndereco = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== "admin" && !(await User.enderecoPertenceAoUsuario(id, req.user.id))) {
        return res.status(404).json({ message: "Endereço não encontrado." });
    }

    try {
        const result = await User.deletarEndereco(id);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Endereço não encontrado." });
        }

        res.status(200).json({ message: "Endereço excluído com sucesso!" });
    } catch (error) {
        if (error.number === 547) {
            return res.status(400).json({
                message: "Este endereço não pode ser excluído porque está vinculado a um ou mais pedidos."
            });
        }
        console.log("Erro ao excluir endereço:", error);
        res.status(500).json({ message: "Erro ao excluir endereço." });
    }
};

exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.getUsuarios();

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
}