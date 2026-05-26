const { sql, conectar } = require("../config/db");

class PedidoItem {
    static async criarPedidoItem({ PedidoId, ProdutoId, Quantidade, PrecoUnitario}) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("PedidoId", sql.Int, PedidoId)
                .input("ProdutoId", sql.Int, ProdutoId)
                .input("Quantidade", sql.Int, Quantidade)
                .input("PrecoUnitario", sql.Decimal(10, 2), PrecoUnitario)
                .query(`
                INSERT INTO PedidoItens (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
                VALUES (@PedidoId, @ProdutoId, @Quantidade, @PrecoUnitario)
            `);

            return true;
        } catch (error) {
            throw error
        }
    }
}

module.exports = PedidoItem;