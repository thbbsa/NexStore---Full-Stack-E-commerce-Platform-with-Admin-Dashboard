const { sql, conectar } = require("../config/db");

class Pagamento {
    static async criarPagamento({ PedidoId, Metodo, Valor}) {
        try {
           const pool = await conectar();
           const result = await pool.request()
                .input("PedidoId", sql.Int, PedidoId)
                .input("Metodo", sql.VarChar(50), Metodo)
                .input("Valor", sql.Decimal(10, 2), Valor)
                .query(`
                    INSERT INTO Pagamentos (PedidoId, Metodo, Valor)
                    VALUES (@PedidoId, @Metodo, @Valor)
                `);
                
            return true;
        } catch (error) {
            throw error
        }
    }
}

module.exports = Pagamento;