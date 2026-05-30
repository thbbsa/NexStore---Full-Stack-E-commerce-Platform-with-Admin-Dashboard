const { sql, conectar } = require("../config/db");

class PedidoEndereco {
    static async criarPedidoEndereco({ PedidoId }) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("PedidoId", sql.Int, PedidoId)
                .query(`
                    INSERT INTO Entregas (PedidoId)
                    VALUES (@PedidoId)
                `);

            return true;
        } catch (error) {
            throw error
        }
    }
}

module.exports = PedidoEndereco