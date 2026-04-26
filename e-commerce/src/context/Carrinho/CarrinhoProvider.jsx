import { useEffect, useState } from "react";
import { CarrinhoContext } from "./CarrinhoContext";

export function CarrinhoProvider({ children }) {
    const [carrinho, setCarrinho] = useState(() => {
        const carrinhoSalvo = localStorage.getItem("carrinho");
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    });

    useEffect(() => {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }, [carrinho]);

    function adicionarProduto(produto) {
        setCarrinho(prev => {
            const existe = prev.some(p => p.Id === produto.Id);

            if (existe) {
                return prev.map(p =>
                    p.Id === produto.Id
                        ? { ...p, quantidade: Math.min(p.quantidade + 1, 6) }
                        : p
                );
            }

            return [...prev, { ...produto, quantidade: 1 }];
        });
    }

    function removerProduto(produtoId) {
        setCarrinho(prev => prev.filter(p => p.Id !== produtoId));
    }

    function alterarQuantidade(produtoId, acao) {
        setCarrinho(prev =>
            prev.map(p => {
                if (p.Id !== produtoId) return p;

                return {
                    ...p,
                    quantidade:
                        acao === "aumentar"
                            ? Math.min(p.quantidade + 1, 6)
                            : Math.max(p.quantidade - 1, 1)
                };
            })
        );
    }

    function calcularTotal() {
        return carrinho.reduce(
            (total, p) => total + p.Preco * p.quantidade,
            0
        );
    }

    return (
        <CarrinhoContext.Provider
            value={{
                carrinho,
                adicionarProduto,
                removerProduto,
                alterarQuantidade,
                calcularTotal
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
}
