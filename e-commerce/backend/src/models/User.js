const { sql, conectar } = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
    static async create(nome, username, email, cpf, telefone, senha) {
        try {
            const hashedPassword = await bcrypt.hash(senha, 10);

            const pool = await conectar();
            const result = await pool.request()
                .input("Nome", sql.NVarChar(100), nome)
                .input("Username", sql.NVarChar(100), username)
                .input("Email", sql.NVarChar(150), email)
                .input("CPF", sql.Char(11), cpf)
                .input("Telefone", sql.Char(11), telefone)
                .input("Senha", sql.NVarChar(200), hashedPassword)
                .query("INSERT INTO Usuarios (Nome, Username, Email, CPF, Telefone, Senha) VALUES (@Nome, @Username, @Email, @CPF, @Telefone, @Senha)");

            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findById(ID) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("Id", sql.Int, ID)
                .query("SELECT * FROM Usuarios WHERE Id = @Id");
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("Username", sql.NVarChar(100), username)
                .query("SELECT * FROM Usuarios WHERE Username = @Username");
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("Email", sql.NVarChar(100), email)
                .query("SELECT * FROM Usuarios WHERE Email = @Email");
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByCPF(cpf) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("CPF", sql.Char(11), cpf)
                .query("SELECT * FROM Usuarios WHERE CPF = @CPF");
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByTelefone(telefone) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("Telefone", sql.Char(11), telefone)
                .query("SELECT * FROM Usuarios WHERE Telefone = @Telefone");
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, userData) {
        try {
            const pool = await conectar();
            const request = pool.request();

            request.input("Id", sql.Int, id);

            let query = "UPDATE Usuarios SET ";

            const fields = [];

            if (userData.Nome !== undefined) {
                request.input("Nome", sql.NVarChar(100), userData.Nome);
                fields.push("Nome = @Nome");
            }

            if (userData.Username !== undefined) {
                request.input("Username", sql.NVarChar(100), userData.Username);
                fields.push("Username = @Username");
            }

            if (userData.Email !== undefined) {
                request.input("Email", sql.NVarChar(150), userData.Email);
                fields.push("Email = @Email");
            }

            if (userData.Telefone !== undefined) {
                request.input("Telefone", sql.Char(11), userData.Telefone);
                fields.push("Telefone = @Telefone");
            }

            query += fields.join(", ");
            query += " WHERE Id = @Id";

            const result = await request.query(query);
            return result;

        } catch (error) {
            throw error;
        }
    }

    static async createEndereco(userId, logradouro, numero, complemento, bairro, cidade, estado, cep) {
        try {
            const pool = await conectar();
            const request = pool.request()
                .input("Rua", sql.VarChar(150), logradouro)
                .input("Numero", sql.VarChar(10), numero)
                .input("Complemento", sql.VarChar(100), complemento)
                .input("Bairro", sql.VarChar(100), bairro)
                .input("Cidade", sql.VarChar(100), cidade)
                .input("Estado", sql.VarChar(100), estado)
                .input("Cep", sql.Char(10), cep)
                .input("UsuarioId", sql.Int, userId)
                .query("INSERT INTO ENDERECO (Rua, Numero, Complemento, Bairro, Cidade, Estado, Cep, UsuarioId) VALUES (@Rua, @Numero, @Complemento, @Bairro, @Cidade, @Estado, @Cep, @UsuarioId)");
            return request;
        } catch (error) {
            console.log("Erro ao atualizar endereço:", error);
        }
    }

    static async getEndereco(userId) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("UsuarioId", sql.Int, userId)
                .query("SELECT * FROM Endereco WHERE UsuarioId = @UsuarioId");
            return result.recordset

        } catch (error) {
            console.log(error)
        }
    }

    static async becomePrincipal(idEndereco) {
    try {
        const pool = await conectar();

        const result = await pool.request()
            .input("Id_endereco", sql.Int, idEndereco)
            .query("SELECT UsuarioId FROM Endereco WHERE Id_endereco = @Id_endereco");

        const usuarioId = result.recordset[0]?.UsuarioId;

        if (!usuarioId) return;

        await pool.request()
            .input("Id_endereco", sql.Int, idEndereco)
            .input("UsuarioId", sql.Int, usuarioId)
            .query(`
                UPDATE Endereco
                SET Principal = CASE WHEN Id_endereco = @Id_endereco THEN 1 ELSE 0 END
                WHERE UsuarioId = @UsuarioId
            `);

    } catch (error) {
        console.log("Erro ao atualizar endereço:", error);
    }
}
}

module.exports = User;
