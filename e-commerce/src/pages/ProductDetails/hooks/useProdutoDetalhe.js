import { useEffect, useState } from "react";
import { buscarProdutoPorId } from "../../../services/produtoService";
import { isAuthenticated } from "../../../services/auth";

export function useProdutoDetalhe(id) { 
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        let ativo = true; // evita atualizar estado se o componente desmontar

        const carregarProduto = async () => {
            try {
                setLoading(true);
                const data = await buscarProdutoPorId(id);
                if (!ativo) return;
                if (!data?.produto) { setErro(true); return; }
                setProduto(data.produto);
            } catch {
                if (ativo) setErro(true);
            } finally {
                if (ativo) setLoading(false);
            }
        };

        const checkAuth = async () => {
            const auth = await isAuthenticated();
            if (ativo) setIsAuth(auth);
        };

        checkAuth();
        carregarProduto();

        return () => { ativo = false; };
    }, [id]);

    return { produto, loading, erro, isAuth };
}