const Pedido = require("../models/Pedido");
const Produto = require("../models/Produto");
const PedidoItem = require("../models/PedidoItem");
const Pagamento = require("../models/Pagamento");
const PedidoEndereco = require("../models/PedidoEndereco");


const jwt = require("jsonwebtoken");
const SECRET_KEY = "48d321f254bb19fe1ffe7cba980b77fcba0f582bbcd1082415723d17ba35d6165198af9f7de15769a018f2c0276d5f8200dc1147ba9aebfed0599c24dcf2e5d2"



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
            console.log(produto)

            if (!produto) {
                return res.status(404).json({
                    message: "Produto não encontrado"
                });
            }

            const pedidoItem = await PedidoItem.criarPedidoItem({
                PedidoId: pedidoCriado.Id,
                ProdutoId: produto.Id,
                Quantidade: item.quantidade,
                PrecoUnitario: produto.PrecoPromocional ? produto.PrecoPromocional : produto.Preco
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

exports.getPedido = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({
            message: "Id do pedido não encontrado!"
        })
    }

    try {

        const detalhePedido = await Pedido.getPedido(id);

        res.status(201).json({
            message: "Pedido encontrado com sucesso",
            pedidoDetalhe: detalhePedido
        });

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erro interno"
        });
    }
}

exports.getPedidos = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Não autenticado' });

    try {
        const decoded = jwt.decode(token, SECRET_KEY);
        const userId = decoded.id;

        const pedidos = await Pedido.getPedidos(userId);

        res.status(201).json({message: "Pedidos Encontrados com sucesso", pedidos})
    } catch (Error) {
        console.log(error)

        res.status(500).json({
            message: "Erro interno"
        });
    }
}