const Pedido = require("../models/Pedido");

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

exports.criarPedido = async (req, res) => {
    const usuarioId = req.user.id;
    const { enderecoId, pagamento, itens, entrega } = req.body;

    const metodo = ["Cartao", "Pix", "Boleto"].find(
        m => m.toLowerCase() === String(pagamento?.metodo).toLowerCase()
    );

    if (!metodo) {
        return res.status(400).json({ message: "Método de pagamento inválido." });
    }

    if (!["normal", "expressa"].includes(entrega)) {
        return res.status(400).json({ message: "Tipo de entrega inválido." });
    }

    if (!Number.isInteger(Number(enderecoId))) {
        return res.status(400).json({ message: "Endereço é obrigatório." });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ message: "O pedido precisa ter itens." });
    }

    // valida e junta itens repetidos do mesmo produto
    const agrupados = new Map();

    for (const item of itens) {
        const produtoId = Number(item.produtoId);
        const quantidade = Number(item.quantidade);

        if (!Number.isInteger(produtoId) || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) {
            return res.status(400).json({ message: "Item inválido no pedido." });
        }

        agrupados.set(produtoId, (agrupados.get(produtoId) || 0) + quantidade);
    }

    const itensValidos = [...agrupados].map(([produtoId, quantidade]) => ({ produtoId, quantidade }));
    const frete = entrega === "expressa" ? 19.9 : 0;

    try {
        const { pedidoId } = await Pedido.criarCompleto({
            usuarioId,
            enderecoId: Number(enderecoId),
            itens: itensValidos,
            metodo,
            frete
        });

        res.status(201).json({ message: "Pedido criado com sucesso", pedidoId });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }

        console.log(error);
        res.status(500).json({ message: "Erro interno" });
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

        if (
            !detalhePedido ||
            (req.user.role !== "admin" && detalhePedido.usuario.id !== req.user.id)
        ) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        res.status(200).json({
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
    try {
        const userId = req.user.id;

        const pedidos = await Pedido.getPedidos(userId);

        res.status(201).json({ message: "Pedidos Encontrados com sucesso", pedidos })
    } catch (Error) {
        console.log(error);
        res.status(500).json({ message: "Erro interno" });
    }
}


exports.getPedidosStats = async (req, res) => {
    try {
        const stats = await Pedido.getPedidosStats();

        res.status(201).json({ message: "Estatísticas de pedidos encontradas com sucesso", stats })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erro interno"
        });
    }
}

exports.getPedidosInfo = async (req, res) => {
    try {
        const info = await Pedido.getPedidosInfo();

        res.status(201).json({ message: "Informações de pedidos encontradas com sucesso", info })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erro interno"
        });
    }
}