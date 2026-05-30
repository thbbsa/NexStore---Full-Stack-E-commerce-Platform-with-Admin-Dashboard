import React from "react";
import "./DetalhePedido.css";

export default function DetalhePedido() {
    return (
        <div className="pedido-container-global">
            <div className="status-pedido">
                <span>Pedido concluído.</span>
            </div>
            <div className="pedido-container">
                <div className="pedido-esquerda">
                    <div className="pedido-card">
                        <div className="pedido-vendedor">
                            Vendido e entregue por: <strong>E-Commerce</strong>
                        </div>

                        <div className="produto">
                            <img
                                src="https://images.kabum.com.br/produtos/fotos/115451/cadeira-gamer-husky-storm-black_1596132737_gg.jpg"
                                alt="Cadeira Gamer"
                            />

                            <div className="produto-info">
                                <h3>
                                    Cadeira Gamer Husky Storm 100, Até 120kg,
                                    Almofadas, Reclinável 135º, PU, Preta
                                </h3>
                                <p>Quantidade: 1</p>
                            </div>

                            <div className="produto-preco">
                                R$ 515,68
                            </div>
                        </div>

                        <div className="rastreio">
                            <strong>RASTREIO:</strong>
                            <span> JADLOG 534501495</span>
                        </div>

                        <div className="acoes">
                            <button>RASTREIO DETALHADO</button>
                            <button>GERENCIAR PEDIDO</button>
                        </div>
                    </div>

                    <div className="timeline">
                        <div className="step ativo">
                            <div className="icone">✓</div>
                            <p>Pedido recebido</p>
                        </div>

                        <div className="linha"></div>

                        <div className="step ativo">
                            <div className="icone">✓</div>
                            <p>Enviado</p>
                        </div>

                        <div className="linha"></div>

                        <div className="step ativo">
                            <div className="icone">✓</div>
                            <p>Em trânsito</p>
                        </div>

                        <div className="linha"></div>

                        <div className="step ativo">
                            <div className="icone">✓</div>
                            <p>Entregue</p>
                        </div>
                    </div>

                </div>

                <div className="pedido-direita">
                    <div className="resumo-card">
                        <h3>Pedido #46292656</h3>

                        <p>Raimundo</p>
                        <p>
                            Rua João Meneghette, 581,
                            Casa, Taboão da Serra - SP
                        </p>

                        <hr />

                        <p>Pagamento: Cartão de Crédito</p>
                        <p>5x sem juros</p>

                        <hr />

                        <div className="linha-resumo">
                            <span>Produtos</span>
                            <span>R$ 515,68</span>
                        </div>

                        <div className="linha-resumo">
                            <span>Frete</span>
                            <span>R$ 74,62</span>
                        </div>

                        <div className="linha-resumo total">
                            <span>Total</span>
                            <span>R$ 590,30</span>
                        </div>

                    </div>

                    <div className="acoes">
                        <button>Avaliar Produto</button>
                    </div>

                </div>

            </div>
        </div>
    );
}