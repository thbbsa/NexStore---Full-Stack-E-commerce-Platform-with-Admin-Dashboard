const Pedido = require("../models/Pedido");
const Produto = require("../models/Produto");
const PedidoItem = require("../models/PedidoItem");
const Pagamento = require("../models/Pagamento");
const PedidoEndereco = require("../models/PedidoEndereco");

exports.criarPedido = async (req, res) => {
    const { userId, enderecoId, total, pagamento } = req.body;
    const { itens } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Usuario é obrigatório" });
    }

    if (!enderecoId) {
        return res.status(400).json({ message: "Endereco é obrigatório" });
    }

    if (!total) {
        return res.status(400).json({ message: "Total é obrigatório" });
    }

    try {
        const pedidoCriado = await Pedido.criarPedidoUsuario(userId, enderecoId, total)
        const pagamentoCriado = await Pagamento.criarPagamento({
            PedidoId: pedidoCriado.Id,
            Metodo: pagamento.metodo,
            Valor: pagamento.valor
        })
        const pedidoEnderecoCriado = await PedidoEndereco.criarPedidoEndereco({
            PedidoId: pedidoCriado.Id,
        })

        for (const item of itens) {
            const produto = await Produto.getProduto(item.produtoId);

            if (!produto) {
                return res.status(404).json({
                    message: "Produto não encontrado"
                });
            }

            const pedidoItem = await PedidoItem.criarPedidoItem({
                PedidoId: pedidoCriado.Id,
                ProdutoId: produto.Id,
                Quantidade: item.quantidade,
                PrecoUnitario: produto.Preco
            });
        }
        

        res.status(201).json({
            message: "Pedido criado com sucesso",
            pedidoId: pedidoCriado.Id
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erro interno"
        });
    }

}