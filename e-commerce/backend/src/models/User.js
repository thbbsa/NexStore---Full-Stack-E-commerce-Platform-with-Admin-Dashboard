const { sql, conectar } = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
    static async create(infoUser) {
        try {
            const hashedPassword = await bcrypt.hash(infoUser.senha, 10);
            const role = infoUser.role || "user"

            const pool = await conectar();
            const result = await pool.request()
                .input("Nome", sql.NVarChar(100), infoUser.nome)
                .input("Username", sql.NVarChar(100), infoUser.username)
                .input("Email", sql.NVarChar(150), infoUser.email)
                .input("CPF", sql.Char(11), infoUser.cpf)
                .input("Telefone", sql.Char(11), infoUser.telefone)
                .input("Senha", sql.NVarChar(200), hashedPassword)
                .input("Role", sql.NVarChar(20), role)
                .query("INSERT INTO Usuarios (Nome, Username, Email, CPF, Telefone, Senha, Role) VALUES (@Nome, @Username, @Email, @CPF, @Telefone, @Senha, @Role)");

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

            if (userData.role !== undefined) {
                request.input("Role", sql.NVarChar(20), userData.role);
                fields.push("Role = @Role");
            }

            if (userData.ativo !== undefined) {
                request.input("Ativo", sql.Bit, userData.ativo);
                fields.push("Ativo = @Ativo");
            }

            if (fields.length === 0) {
                return null; // nada pra atualizar
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

    static async updateEndereco(idEndereco, updates) {
        try {
            const pool = await conectar();
            const request = pool.request();
            request.input("Id_endereco", sql.Int, idEndereco);

            let query = "UPDATE Endereco SET ";

            const fields = [];

            if (updates.Rua !== undefined) {
                request.input("Rua", sql.VarChar(150), updates.Rua);
                fields.push("Rua = @Rua");
            }

            if (updates.Numero !== undefined) {
                request.input("Numero", sql.VarChar(10), updates.Numero);
                fields.push("Numero = @Numero");
            }
            if (updates.Complemento !== undefined) {
                request.input("Complemento", sql.VarChar(100), updates.Complemento);
                fields.push("Complemento = @Complemento");
            }
            if (updates.Bairro !== undefined) {
                request.input("Bairro", sql.VarChar(100), updates.Bairro);
                fields.push("Bairro = @Bairro");
            }
            if (updates.Cidade !== undefined) {
                request.input("Cidade", sql.VarChar(100), updates.Cidade);
                fields.push("Cidade = @Cidade");
            }
            if (updates.Estado !== undefined) {
                request.input("Estado", sql.VarChar(100), updates.Estado);
                fields.push("Estado = @Estado");
            }
            if (updates.Cep !== undefined) {
                request.input("Cep", sql.Char(10), updates.Cep);
                fields.push("Cep = @Cep");
            }

            query += fields.join(", ");
            query += " WHERE Id_endereco = @Id_endereco";

            const result = await request.query(query);
            return result;
        } catch (error) {
            console.log("Erro ao atualizar endereço:", error);
        }
    }

    static async anonimizar(id) {
        try {
            const pool = await conectar();

            // CPF e Telefone são CHAR(11) NOT NULL UNIQUE — precisam de um valor
            // de 11 caracteres, único por usuário, senão a query quebra a constraint.
            const cpfAnonimo = String(id).padStart(11, "9");
            const telefoneAnonimo = String(id).padStart(11, "8");

            const result = await pool.request()
                .input("Id", sql.Int, id)
                .input("Nome", sql.NVarChar(100), `Usuário Excluído #${id}`)
                .input("Username", sql.NVarChar(100), `usuario_excluido_${id}`)
                .input("Email", sql.NVarChar(150), `excluido_${id}@anonimizado.local`)
                .input("CPF", sql.Char(11), cpfAnonimo)
                .input("Telefone", sql.Char(11), telefoneAnonimo)
                .input("Ativo", sql.Bit, 0)
                .query(`
                UPDATE Usuarios
                SET Nome = @Nome,
                    Username = @Username,
                    Email = @Email,
                    CPF = @CPF,
                    Telefone = @Telefone,
                    Ativo = @Ativo
                WHERE Id = @Id
            `);

            return result;
        } catch (error) {
            console.log("Erro ao anonimizar usuário:", error);
            throw error;
        }
    }

    static async deletarEndereco(idEndereco) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("Id_endereco", sql.Int, idEndereco)
                .query("DELETE FROM Endereco WHERE Id_endereco = @Id_endereco");
            return result;
        } catch (error) {
            throw error; 
        }
    }

}

module.exports = User;
