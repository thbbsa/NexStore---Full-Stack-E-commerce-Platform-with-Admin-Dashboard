import { useState, useEffect } from "react";
import { getPedido } from "../../../services/userService";

export function useDetalhePedido(pedidoId) {
    const [pedidoDetalhe, setPedidoDetalhe] = useState({
        itens: [],
        pagamento: {},
        usuario: {},
        endereco: {}
    });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState()

    useEffect(() => {
        let ativo = true;
        const buscarDetalhePedido = async () => {
            try {
                const response = await getPedido(pedidoId);
                
                if (!ativo) return;
                if (!response.pedidoDetalhe) { setErro(true); return; }

                setPedidoDetalhe(
                    response?.pedidoDetalhe || {
                        itens: [],
                        pagamento: {},
                        usuario: {},
                        endereco: {}
                    }
                );
            } catch (error) {
                if (ativo) setErro(true);
                console.error("Erro ao buscar pedido:", error);
            } finally {
                if (ativo) setLoading(false);
            }
        };

        buscarDetalhePedido();

        return () => { ativo = false; };
    }, [pedidoId])

    return {
        pedidoDetalhe,
        loading,
        erro
    }
}