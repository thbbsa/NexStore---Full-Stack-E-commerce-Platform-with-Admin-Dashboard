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

    static async getPedido(id) {
        try {
            const pool = await conectar();

            const pedido = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                SELECT
                    p.*,

                    u.Nome AS UsuarioNome,
                    u.Email AS UsuarioEmail,
                    u.Telefone AS UsuarioTelefone,

                    e.*

                FROM Pedidos p

                INNER JOIN Usuarios u
                    ON p.UsuarioId = u.Id

                INNER JOIN Endereco e
                    ON p.EnderecoId = e.Id_endereco

                WHERE p.Id = @Id
            `);

            if (pedido.recordset.length === 0) {
                return null;
            }

            const itens = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                SELECT
                    pi.Id,
                    pi.Quantidade,
                    pi.PrecoUnitario,
                    pi.Subtotal,

                    p.Id AS ProdutoId,
                    p.Nome,
                    p.Imagem,
                    p.Marca

                FROM PedidoItens pi
                INNER JOIN Produtos p
                    ON pi.ProdutoId = p.Id

                WHERE pi.PedidoId = @Id
            `);

            const pagamento = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                SELECT
                    Metodo,
                    Status,
                    Valor,
                    DataPagamento
                FROM Pagamentos
                WHERE PedidoId = @Id
            `);

            const pedidoInfo = pedido.recordset[0];

            return {
                id: pedidoInfo.Id,
                dataPedido: pedidoInfo.DataPedido,
                status: pedidoInfo.Status,
                total: pedidoInfo.Total,

                usuario: {
                    id: pedidoInfo.UsuarioId,
                    nome: pedidoInfo.UsuarioNome,
                    email: pedidoInfo.UsuarioEmail,
                    telefone: pedidoInfo.UsuarioTelefone
                },

                endereco: {
                    id: pedidoInfo.Id_endereco,
                    rua: pedidoInfo.Rua,
                    numero: pedidoInfo.Numero,
                    complemento: pedidoInfo.Complemento,
                    bairro: pedidoInfo.Bairro,
                    cidade: pedidoInfo.Cidade,
                    estado: pedidoInfo.Estado,
                    cep: pedidoInfo.Cep,
                    principal: pedidoInfo.Principal
                },

                pagamento: pagamento.recordset[0] || null,

                itens: itens.recordset
            };

        } catch (error) {
            throw error;
        }
    }
}

module.exports = Pedido;