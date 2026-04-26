import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarrinhoContext } from "../../context/Carrinho/CarrinhoContext";
import "./carrinho.css";

const STEPS = ["Carrinho", "Identificação", "Pagamento", "Concluído"];

const Carrinho = () => {
    const { carrinho, removerProduto, alterarQuantidade, calcularTotal } = useContext(CarrinhoContext);
    const navigate = useNavigate();

    return (
        <div className="cart-page">
            <div className="cart-container">

                {/* Stepper */}
                <div className="cart-stepper">
                    {STEPS.map((step, i) => (
                        <div key={i} className={`cart-step${i === 0 ? " active" : ""}`}>
                            <div className="cart-step-number">{i + 1}</div>
                            <span className="cart-step-label">{step}</span>
                        </div>
                    ))}
                </div>

                <h1 className="cart-title">Meu Carrinho</h1>

                {/* Card principal */}
                <div className="cart-card">

                    {/* Cabeçalho */}
                    <div className="cart-table-head">
                        <span>Produto</span>
                        <span>Quantidade</span>
                        <span>Valor</span>
                    </div>

                    {/* Itens */}
                    {carrinho.length > 0 ? (
                        carrinho.map(produto => {
                            const precoUnit = produto.PrecoPromocional ?? produto.Preco ?? produto.price ?? 0;
                            const subtotal = (precoUnit * produto.quantidade).toFixed(2);

                            return (
                                <div className="cart-item" key={produto.Id}>

                                    {/* Produto */}
                                    <div className="cart-item-product">
                                        <img
                                            className="cart-item-img"
                                            src={`http://localhost:3000${produto.Imagem}`}
                                            alt={produto.Nome}
                                        />
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{produto.Nome}</div>
                                            <button
                                                className="cart-item-remove"
                                                onClick={() => removerProduto(produto.Id)}
                                            >
                                                <span className="msymbol">delete</span>
                                                Remover
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantidade */}
                                    <div className="cart-qty">
                                        <button
                                            className="cart-qty-btn"
                                            onClick={() => alterarQuantidade(produto.Id, "diminuir")}
                                        >−</button>
                                        <span className="cart-qty-value">{produto.quantidade}</span>
                                        <button
                                            className="cart-qty-btn"
                                            onClick={() => alterarQuantidade(produto.Id, "aumentar")}
                                        >+</button>
                                    </div>

                                    {/* Valor */}
                                    <div className="cart-item-price">
                                        <div className="cart-item-price-total">R$ {subtotal}</div>
                                        <div className="cart-item-price-unit">R$ {Number(precoUnit).toFixed(2)} / unid.</div>
                                    </div>

                                </div>
                            );
                        })
                    ) : (
                        <div className="cart-empty">
                            <span className="cart-empty-icon">shopping_cart</span>
                            <h3>Carrinho vazio</h3>
                            <p>Adicione produtos para continuar comprando.</p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="cart-footer">

                    {/* Esquerda: pagamento + frete */}
                    <div className="cart-footer-left">

                        <div className="cart-footer-row">
                            <span className="msymbol">payments</span>
                            <span>Ver formas de pagamento e parcelamento</span>
                        </div>

                        <div className="cart-footer-row">
                            <span className="msymbol">local_shipping</span>
                            <div>
                                <div>Calcule o frete pelo CEP</div>
                                <div className="cart-cep-wrap">
                                    <input
                                        className="cart-cep-input"
                                        placeholder="00000-000"
                                    />
                                    <button className="cart-cep-btn">Calcular</button>
                                </div>
                                <a href="#" className="cart-cep-link">Não sei meu CEP</a>
                            </div>
                        </div>

                    </div>

                    {/* Direita: total + botões */}
                    <div className="cart-footer-right">
                        <div>
                            <div className="cart-total-label">Total</div>
                            <div className="cart-total-value">
                                <span>R$</span>{calcularTotal().toFixed(2)}
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button className="cart-btn-checkout" onClick={() => navigate("/identificacao")}>
                                <span className="msymbol">bolt</span>
                                Finalizar Compra
                            </button>
                            <button
                                className="cart-btn-continue"
                                onClick={() => navigate("/")}
                            >
                                <span className="msymbol">arrow_back</span>
                                Continuar comprando
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Carrinho;