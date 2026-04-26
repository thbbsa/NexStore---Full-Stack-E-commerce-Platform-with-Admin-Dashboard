import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarProdutoPorId } from "../../services/produtoService";
import Breadcrumb from "../../componentes/BreadCrumb/Breadcrumb";
import { CarrinhoContext } from "../../context/Carrinho/CarrinhoContext";
import { isAuthenticated } from "../../services/auth";
import "./ProdutoDetalhe.css";

const ProdutoDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { adicionarProduto } = useContext(CarrinhoContext);

    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        const carregarProduto = async () => {
            try {
                setLoading(true);
                const data = await buscarProdutoPorId(id);
                if (!data?.produto) { setErro(true); return; }
                setProduto(data.produto);
            } catch {
                setErro(true);
            } finally {
                setLoading(false);
            }
        };

        const checkAuth = async () => {
            const auth = await isAuthenticated();
            setIsAuth(auth);
        };

        checkAuth();
        carregarProduto();
    }, [id]);

    if (loading) {
        return (
            <div className="pd-page">
                <div className="pd-state">
                    <div className="pd-spinner" />
                    <p>Carregando produto...</p>
                </div>
            </div>
        );
    }

    if (erro || !produto) {
        return (
            <div className="pd-page">
                <div className="pd-state">
                    <span className="pd-state-icon">inventory_2</span>
                    <h3>Produto não encontrado</h3>
                    <p>O item que você procura não está disponível.</p>
                    <button className="pd-btn-back" onClick={() => navigate("/")}>
                        <span className="msymbol">arrow_back</span>
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    const emEstoque = produto.Estoque > 0;
    const temPromo = produto.PrecoPromocional && produto.PrecoPromocional < produto.Preco;
    const discount = temPromo
        ? Math.round(((produto.Preco - produto.PrecoPromocional) / produto.Preco) * 100)
        : null;

    const handleComprar = () => {
        if (isAuth) { adicionarProduto(produto); navigate("/carrinho"); }
        else navigate("/login");
    };

    const handleAddCart = () => {
        if (isAuth) adicionarProduto(produto);
        else navigate("/login");
    };

    return (
        <div className="pd-page">
            <div className="pd-container">

                <Breadcrumb
                    paths={[
                        { name: "Home", link: "/" },
                        { name: "Hardware", link: `/categoria/${produto.CategoriaId}` },
                        produto.Nome,
                    ]}
                />

                {/* Grid principal */}
                <div className="pd-main">

                    {/* Imagem */}
                    <div className="pd-card">
                        <div className="pd-img-wrap">
                            <img
                                src={`http://localhost:3000${produto.Imagem}`}
                                alt={produto.Nome}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pd-card">
                        <div className="pd-info">

                            <div className="pd-section-tag">Produto</div>

                            <h2 className="pd-title">{produto.Nome}</h2>

                            {/* Rating */}
                            <div className="pd-rating">
                                <div className="pd-stars">
                                    {[1,2,3,4,5].map(i => (
                                        <span key={i} className={`pd-star${i > 4 ? " empty" : ""}`}>star</span>
                                    ))}
                                </div>
                                <span className="pd-reviews">(127 avaliações)</span>
                            </div>

                            {/* Preço */}
                            <div className="pd-price-block">
                                {temPromo && (
                                    <div className="pd-price-original">
                                        R$ {Number(produto.Preco).toFixed(2)}
                                    </div>
                                )}
                                <div>
                                    <span className="pd-price-main">
                                        <span className="currency">R$</span>
                                        {Number(temPromo ? produto.PrecoPromocional : produto.Preco).toFixed(2)}
                                    </span>
                                    {discount && (
                                        <span className="pd-price-discount">-{discount}%</span>
                                    )}
                                </div>
                                <div className="pd-installments">à vista no PIX ou até 10x sem juros</div>
                            </div>

                            {/* Estoque */}
                            <div className={`pd-stock ${emEstoque ? "in" : "out"}`}>
                                <span className="msymbol">
                                    {emEstoque ? "check_circle" : "cancel"}
                                </span>
                                {emEstoque ? "Em estoque" : "Esgotado"}
                            </div>

                            {/* Botões */}
                            <div className="pd-actions">
                                <button className="pd-btn-buy" disabled={!emEstoque} onClick={handleComprar}>
                                    <span className="msymbol">bolt</span>
                                    Comprar agora
                                </button>
                                <button className="pd-btn-cart" disabled={!emEstoque} onClick={handleAddCart}>
                                    <span className="msymbol">shopping_cart</span>
                                    Adicionar ao carrinho
                                </button>
                            </div>

                            {/* Entrega */}
                            <div className="pd-delivery">
                                <span className="msymbol">local_shipping</span>
                                Entrega estimada: 3 a 7 dias úteis
                            </div>

                        </div>
                    </div>
                </div>

                {/* Descrição + Specs */}
                <div className="pd-lower">

                    <div className="pd-section">
                        <div className="pd-section-title">Descrição</div>
                        <p className="pd-desc-short">{produto.DescricaoCurta}</p>
                        <p className="pd-desc-full">{produto.DescricaoCompleta}</p>
                    </div>

                    <div className="pd-section">
                        <div className="pd-section-title">Especificações</div>
                        <table className="pd-specs-table">
                            <tbody>
                                <tr><th>Marca</th><td>{produto.Marca || "—"}</td></tr>
                                <tr><th>Modelo</th><td>—</td></tr>
                                <tr><th>SKU</th><td>{produto.SKU || "—"}</td></tr>
                                <tr><th>Peso</th><td>{produto.Peso || "—"}</td></tr>
                                <tr><th>Dimensões</th><td>{produto.Dimensoes || "—"}</td></tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProdutoDetalhe;