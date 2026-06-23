import { useState, useEffect } from "react";

export function useBuscarProduto() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const carregarProdutos = async () => {
            setLoading(true)
            try {
                const data = await buscarProdutosPorQuery(
                    query ?? null,
                    categoriaId ?? null
                );
                setProdutos(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false)
            }
        };
        carregarProdutos();
    }, [query, categoriaId]);

    return {
        loading,
        produtos
    }

}