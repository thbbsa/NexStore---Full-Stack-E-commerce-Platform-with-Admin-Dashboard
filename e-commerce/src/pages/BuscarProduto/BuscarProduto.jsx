import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { buscarProdutosPorQuery } from "../../services/produtoService";
import Header from "../../componentes/Header/Header";
import ProductCard from "../../componentes/ProductCard/ProductCard";
import "./buscarProduto.css";

const CATEGORIAS = {
    1: "Hardware",
    2: "Periféricos",
    3: "Computadores",
    4: "Games",
    5: "Celular & Smartphone",
    6: "Áudio",
};

const BuscarProduto = () => {
    const [searchParams] = useSearchParams();
    const [produtos, setProdutos] = useState([]);
    const [ordenacao, setOrdenacao] = useState("padrao");
    const [exibir, setExibir] = useState(20);

    const query = searchParams.get("q");
    const categoriaId = searchParams.get("categoria");
    const navigate = useNavigate();

    const categoriaNome = categoriaId
        ? (CATEGORIAS[Number(categoriaId)] ?? "Outros")
        : query
        ? `"${query}"`
        : "Todos os produtos";

    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                const data = await buscarProdutosPorQuery(
                    query ?? null,
                    categoriaId ?? null
                );
                setProdutos(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        carregarProdutos();
    }, [query, categoriaId]);

    // Ordenação local
    const produtosOrdenados = [...produtos]
        .sort((a, b) => {
            const pa = a.PrecoPromocional ?? a.Preco;
            const pb = b.PrecoPromocional ?? b.Preco;
            if (ordenacao === "asc") return pa - pb;
            if (ordenacao === "desc") return pb - pa;
            return 0;
        })
        .slice(0, exibir);

    return (
        <div className="bp-page">
            <Header />

            <div className="bp-container">

                {/* Heading */}
                <div className="bp-heading">
                    <span className="bp-heading-label">
                        {categoriaId ? "Categoria" : "Busca"}:
                    </span>
                    <span className="bp-heading-value">{categoriaNome}</span>
                    <span className="bp-heading-count">
                        <strong>{produtos.length}</strong> produto{produtos.length !== 1 ? "s" : ""} encontrado{produtos.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Filtros */}
                <div className="bp-filters">

                    <div className="bp-filter-group">
                        <label className="bp-filter-label">Ordenar</label>
                        <select
                            className="bp-select"
                            value={ordenacao}
                            onChange={(e) => setOrdenacao(e.target.value)}
                        >
                            <option value="padrao">Relevância</option>
                            <option value="asc">Menor preço</option>
                            <option value="desc">Maior preço</option>
                        </select>
                    </div>

                    <div className="bp-divider" />

                    <div className="bp-filter-group">
                        <label className="bp-filter-label">Exibir</label>
                        <select
                            className="bp-select"
                            value={exibir}
                            onChange={(e) => setExibir(Number(e.target.value))}
                        >
                            <option value={20}>20 por página</option>
                            <option value={40}>40 por página</option>
                            <option value={60}>60 por página</option>
                        </select>
                    </div>

                </div>

                {/* Grid */}
                <div className="bp-grid">

                    {produtosOrdenados.length === 0 ? (
                        <div className="bp-empty">
                            <span className="bp-empty-icon">search_off</span>
                            <h3>Nenhum produto encontrado</h3>
                            <p>Tente buscar por outro termo ou navegue pelas categorias.</p>
                            <button className="bp-empty-btn" onClick={() => navigate("/")}>
                                <span className="msymbol">arrow_back</span>
                                Voltar para Home
                            </button>
                        </div>
                    ) : (
                        produtosOrdenados.map((item) => {
                            const temPromo =
                                item.PrecoPromocional != null &&
                                item.PrecoPromocional < item.Preco;

                            return (
                                <ProductCard
                                    key={item.Id}
                                    id={item.Id}
                                    img={`http://localhost:3000${item.Imagem}`}
                                    name={item.Nome}
                                    price={item.Preco}
                                    promoPrice={temPromo ? item.PrecoPromocional : null}
                                    rating={5}
                                    reviews={0}
                                />
                            );
                        })
                    )}

                </div>
            </div>
        </div>
    );
};

export default BuscarProduto;