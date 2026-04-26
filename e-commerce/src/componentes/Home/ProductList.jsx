import ProductCard from "../ProductCard/ProductCard.jsx";
import { buscarProdutosPublicos } from "../../services/produtoService.js";
import { useState, useEffect } from "react";

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregarProduto() {
      try {
        const result = await buscarProdutosPublicos();
        setProdutos(result);
      } catch (error) {
        console.error("Erro ao carregar produto", error);
      }
    }

    carregarProduto();
  }, []);

  if (produtos.length === 0) {
    return <p className="text-center my-5">Nenhum produto disponível</p>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Produtos em Destaque</h2>

      <div className="row g-4">
        {produtos.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.Id}>
            <ProductCard
              id={p.Id}
              img={`http://localhost:3000${p.Imagem}`}
              name={p.Nome}
              price={p.Preco}
              promoPrice={p.PrecoPromocional}
              ativo={p.Ativo}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
