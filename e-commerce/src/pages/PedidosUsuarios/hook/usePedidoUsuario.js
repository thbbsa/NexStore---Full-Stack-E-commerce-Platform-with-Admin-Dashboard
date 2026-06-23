import React, { use, useEffect, useState } from "react"
import { getPedidos } from "../../../services/userService"

export function usePedidoUsuario() {
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState()
    const [erro, setErro] = useState()

    useEffect(() => {
        let ativo = true; 

        const carregarPedidos = async () => {
            try {
                setLoading(true);
                const response = await getPedidos()
                if (!ativo) return;
                if (!response.pedidos) { setErro(true); return; }
                setPedidos(response.pedidos);
            } catch {
                if (ativo) setErro(true);
            } finally {
                if (ativo) setLoading(false);
            }
        };
        carregarPedidos();

        return () => { ativo = false; };
    }, [])

    return {
        pedidos,
        loading,
        erro
    }
}