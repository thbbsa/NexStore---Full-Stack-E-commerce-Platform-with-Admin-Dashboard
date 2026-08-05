const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const SECRET_KEY = "48d321f254bb19fe1ffe7cba980b77fcba0f582bbcd1082415723d17ba35d6165198af9f7de15769a018f2c0276d5f8200dc1147ba9aebfed0599c24dcf2e5d2"


exports.register = async (req, res) => {
    const infoUser = req.body;


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

exports.login = async (req, res) => {
    const { email, senha, rememberMe } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ message: "Email não encontrado." });

        const correctPassword = await bcrypt.compare(senha, user.Senha);
        if (!correctPassword) return res.status(400).json({ message: "Senha incorreta." });

        const token = jwt.sign(
            { id: user.Id, username: user.Username, email: user.Email },
            SECRET_KEY,
            { expiresIn: rememberMe ? "7d" : "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 7 days or 1h
        });

        return res.status(200).json({ message: "Login realizado com sucesso!", user: { username: user.username, email: user.email } });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro ao fazer login." });
    }
};


exports.getMe = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
        const decoded = jwt.decode(token, SECRET_KEY);
        const userId = decoded.id;

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: "Usuario Encontrado!", user })
    } catch (error) {
        console.log(error)
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
    const updates = req.body;

    try {

        if (updates.Username) {
            const existingUser = await User.findByUsername(updates.Username);
            if (existingUser && existingUser.id != id) {
                return res.status(400).json({ message: "Username já existe." });
            }
        }

        if (updates.Email) {
            const existingEmail = await User.findByEmail(updates.Email);
            if (existingEmail && existingEmail.id != id) {
                return res.status(400).json({ message: "Email já registrado." });
            }
        }

        if (updates.Telefone) {
            const existingTelefone = await User.findByTelefone(updates.Telefone);
            if (existingTelefone && existingTelefone.id != id) {
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
        res.status(500).json({ message: "Erro ao atualizar usuário.", error });
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
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
        const decoded = jwt.decode(token, SECRET_KEY);
        const userIdAlvo = req.params.id || decoded.id;

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
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Não autenticado' });

    try {
        const decoded = jwt.decode(token, SECRET_KEY);
        const userId = decoded.id;

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
    const { Principal} = updates;

    try {


        if (Principal !== undefined) {
            const endereco = await User.becomePrincipal(id);

            res.status(200).json({ message: "Endereço setado como principal", endereco });
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