import { useState, useEffect } from "react";
import { buscarProdutosPorQuery } from "../../../services/produtoService";

export function useBuscarProduto(query, categoriaId) {
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