const Pedido = require("../models/Pedido");

exports.avancarStatusPedido = async (req, res) => {
    const { pedidoId } = req.params;
    
    if (!Number.isInteger(Number(pedidoId))) {
        res.status(400).json({ error: "ID do pedido inválido." });
        return;
    } 
    
    try {
        const novoStatus = await Pedido.avancarStatus(pedidoId);
        res.status(200).json({ message: "Status do pedido atualizado com sucesso.", novoStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar o status do pedido." });
    }
}