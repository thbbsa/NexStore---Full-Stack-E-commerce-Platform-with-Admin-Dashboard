const { sql, conectar } = require("../config/db");

function erroPedido(message, status) {
    const err = new Error(message);
    err.status = status;
    return err;
}

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


    static async criarCompleto({ usuarioId, enderecoId, itens, metodo, frete }) {
        const pool = await conectar();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. o endereço é do usuário?
            const end = await new sql.Request(transaction)
                .input("EnderecoId", sql.Int, enderecoId)
                .input("UsuarioId", sql.Int, usuarioId)
                .query(`SELECT 1 AS ok FROM Endereco
                    WHERE Id_endereco = @EnderecoId AND UsuarioId = @UsuarioId`);

            if (end.recordset.length === 0) {
                throw erroPedido("Endereço inválido.", 400);
            }

            // 2. preço e estoque vêm do banco, nunca do navegador
            let subtotalCentavos = 0;
            const itensValidados = [];

            for (const item of itens) {
                const r = await new sql.Request(transaction)
                    .input("Id", sql.Int, item.produtoId)
                    .query(`SELECT Id, Nome, Preco, PrecoPromocional, Estoque, Ativo
                        FROM Produtos WITH (UPDLOCK, ROWLOCK)
                        WHERE Id = @Id`);

                const produto = r.recordset[0];

                if (!produto || !produto.Ativo) {
                    throw erroPedido(`Produto ${item.produtoId} indisponível.`, 400);
                }

                if (produto.Estoque < item.quantidade) {
                    throw erroPedido(`Estoque insuficiente para "${produto.Nome}".`, 409);
                }

                const preco = produto.PrecoPromocional > 0 ? produto.PrecoPromocional : produto.Preco;
                subtotalCentavos += Math.round(preco * 100) * item.quantidade;

                itensValidados.push({
                    produtoId: produto.Id,
                    quantidade: item.quantidade,
                    preco
                });
            }

            const total = (subtotalCentavos + Math.round(frete * 100)) / 100;

            // 3. pedido
            const pedidoResult = await new sql.Request(transaction)
                .input("UsuarioId", sql.Int, usuarioId)
                .input("EnderecoId", sql.Int, enderecoId)
                .input("Total", sql.Decimal(10, 2), total)
                .query(`INSERT INTO Pedidos (UsuarioId, EnderecoId, Total)
                    OUTPUT INSERTED.Id
                    VALUES (@UsuarioId, @EnderecoId, @Total)`);

            const pedidoId = pedidoResult.recordset[0].Id;

            // 4. pagamento e entrega
            await new sql.Request(transaction)
                .input("PedidoId", sql.Int, pedidoId)
                .input("Metodo", sql.VarChar(50), metodo)
                .input("Valor", sql.Decimal(10, 2), total)
                .query(`INSERT INTO Pagamentos (PedidoId, Metodo, Valor)
                    VALUES (@PedidoId, @Metodo, @Valor)`);

            await new sql.Request(transaction)
                .input("PedidoId", sql.Int, pedidoId)
                .query(`INSERT INTO Entregas (PedidoId) VALUES (@PedidoId)`);

            // 5. itens (a trigger baixa o estoque)
            for (const item of itensValidados) {
                await new sql.Request(transaction)
                    .input("PedidoId", sql.Int, pedidoId)
                    .input("ProdutoId", sql.Int, item.produtoId)
                    .input("Quantidade", sql.Int, item.quantidade)
                    .input("PrecoUnitario", sql.Decimal(10, 2), item.preco)
                    .query(`INSERT INTO PedidoItens (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
                        VALUES (@PedidoId, @ProdutoId, @Quantidade, @PrecoUnitario)`);
            }

            await transaction.commit();
            return { pedidoId, total };

        } catch (error) {
            try { await transaction.rollback(); } catch (_) { /* já abortada */ }
            throw error;
        }
    }

    static async getPedido(id) {
        try {
            const pool = await conectar();

            const pedido = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
            SELECT
                p.Id,
                p.DataPedido,
                p.Status,
                p.Total,
                p.UsuarioId,
                p.EnderecoId,
                
                u.Id AS ClienteId,
                u.Nome AS UsuarioNome,
                u.Email AS UsuarioEmail,
                u.Telefone AS UsuarioTelefone,

                e.Id_endereco,
                e.Rua,
                e.Numero,
                e.Complemento,
                e.Bairro,
                e.Cidade,
                e.Estado,
                e.Cep,
                e.Principal

            FROM Pedidos p
            INNER JOIN Usuarios u ON p.UsuarioId = u.Id
            INNER JOIN Endereco e ON p.EnderecoId = e.Id_endereco
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
            INNER JOIN Produtos p ON pi.ProdutoId = p.Id
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
                    id: pedidoInfo.ClienteId,
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

                pagamento: pagamento.recordset[0]
                    ? {
                        metodo: pagamento.recordset[0].Metodo,
                        status: pagamento.recordset[0].Status,
                        valor: pagamento.recordset[0].Valor,
                        dataPagamento: pagamento.recordset[0].DataPagamento
                    }
                    : null,

                itens: itens.recordset.map(item => ({
                    id: item.Id,
                    quantidade: item.Quantidade,
                    precoUnitario: item.PrecoUnitario,
                    subtotal: item.Subtotal,
                    produtoId: item.ProdutoId,
                    nome: item.Nome,
                    imagem: item.Imagem,
                    marca: item.Marca
                }))
            };

        } catch (error) {
            throw error;
        }
    }

    static async getPedidos(usuarioId) {
        const pool = await conectar();

        const resultado = await pool.request()
            .input("UsuarioId", sql.Int, usuarioId)
            .query(`
            SELECT
                p.Id AS PedidoId,
                p.DataPedido,
                p.Status AS PedidoStatus,
                p.Total,

                pg.Metodo AS MetodoPagamento,
                pg.Status AS StatusPagamento,

                e.Status AS StatusEntrega,
                e.CodigoRastreio,

                pr.Id AS ProdutoId,
                pr.Nome AS ProdutoNome,
                pr.Imagem,

                pi.Quantidade,
                pi.PrecoUnitario

            FROM Pedidos p

            INNER JOIN Pagamentos pg
                ON pg.PedidoId = p.Id

            INNER JOIN Entregas e
                ON e.PedidoId = p.Id

            INNER JOIN PedidoItens pi
                ON pi.PedidoId = p.Id

            INNER JOIN Produtos pr
                ON pr.Id = pi.ProdutoId

            WHERE p.UsuarioId = @UsuarioId

            ORDER BY p.DataPedido DESC
        `);

        return resultado.recordset;
    }

    static async getPedidosStats() {
        const pool = await conectar();
        const resultado = await pool.request()
            .query(`
                SELECT 
                COUNT(*) AS TotalPedidos,
                SUM(CASE WHEN Status <> 'Cancelado' THEN Total ELSE 0 END) AS TotalVendas,
                COUNT(CASE WHEN Status = 'Pendente' THEN 1 END) AS AguardandoPagamento,
                COUNT(CASE WHEN Status = 'Pago' THEN 1 END) AS ParaEnviar
            FROM Pedidos
            `)
        return resultado.recordset[0];
    }

    static async getPedidosInfo() {
        const pool = await conectar();
        const resultado = await pool.request()
            .query(`
                SELECT 
                    p.Id AS PedidoId,
                    p.DataPedido,
                    p.Status AS PedidoStatus,
                    p.Total,
                    pg.Metodo AS MetodoPagamento,
                    pg.Status AS StatusPagamento,
                    e.Status AS StatusEntrega,
                    u.Nome AS UsuarioNome,
                    u.Email AS UsuarioEmail
                    From Pedidos p
                    INNER JOIN Pagamentos pg ON pg.PedidoId = p.Id
                    INNER JOIN Entregas e ON e.PedidoId = p.Id
                    INNER JOIN Usuarios u ON u.Id = p.UsuarioId
            `)
        return resultado.recordset;
    }

}



module.exports = Pedido;