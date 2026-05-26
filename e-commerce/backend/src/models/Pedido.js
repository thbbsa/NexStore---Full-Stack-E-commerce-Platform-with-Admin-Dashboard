const { sql, conectar } = require("../config/db");

class Pedido {
    static async criarPedidoUsuario(userId, enderecoId, total) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("UsuarioId", sql.Int, userId)
                .input("EnderecoId", sql.Int, enderecoId)
                .input("Total", sql.Int, total)
                .query(`
                INSERT INTO PEDIDOS (UsuarioId, EnderecoId, Total)
                OUTPUT INSERTED.*
                VALUES (@UsuarioId, @EnderecoId, @Total)
            `);

            return result.recordset[0]
        } catch (error) {
            throw error
        }
    }
}

module.exports = Pedido;