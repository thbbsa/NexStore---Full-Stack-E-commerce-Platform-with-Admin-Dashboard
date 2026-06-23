import React, { useEffect, useState, useContext } from "react";
import "./DetalhePedido.css";
import { useParams, useNavigate } from "react-router-dom";
import { getPedido } from "../../services/userService";
import Header from "../../componentes/Header/Header.jsx";

import { CheckoutContext } from "../../context/CheckoutContext/CheckoutContext";
import { useDetalhePedido } from "./hook/useDetalhePedido.js";


const MSIcon = ({ name, size = 17, fill = 0, wght = 400 }) => (
    <span
        className="ms"
        style={{
            fontSize: size,
            fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' 0, 'opsz' 20`,
        }}
    >
        {name}
    </span>
);


export default function DetalhePedido() {
    const { pedidoId } = useParams();
    const navigate = useNavigate();

    const { dadosCheckout } = useContext(CheckoutContext);

    const freteValor = dadosCheckout.tipoEntrega?.preco === "Grátis" ? 0 : 19.90;

    const etapas = [
        "Pendente",
        "Confirmado",
        "Enviado",
        "Em trânsito",
        "Entregue"
    ];

    const [messageError, setMessageError] = useState("");

    const {
        pedidoDetalhe,
        loading,
        erro
    } = useDetalhePedido(pedidoId);

    const etapaAtual = etapas.indexOf(pedidoDetalhe?.status);

    function exibirMensagemError(mensagem) {
        setMessageError(mensagem)

        setTimeout(() => {
            setMessageError("")
        }, 3000)
    }

    const avaliarProduto = () => {
        if (etapas[etapaAtual] !== "Entregue") {
            exibirMensagemError("Sua avaliação será liberada após a confirmação da entrega.")
        }
    }

    if (loading) {
        return (
            <div className="pd-page">
                <div className="pd-state">
                    <div className="pd-spinner" />
                    <p>Carregando pedido...</p>
                </div>
            </div>
        );
    }

    if (erro || !pedidoDetalhe) {
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

    return (
        <div className="pedido-container-global">
            <Header />
            <div className="container-detalhe-pedido">
                <div className="ck-message-error-wrap">
                    <div className={`ck-error-message ${messageError ? "show" : ""}`}>
                        <MSIcon name="error" size={16} fill={1} />
                        <span>{messageError || "Erro"}</span>
                    </div>
                </div>

                <div className="status-pedido">
                    <span>
                        Status do pedido: {pedidoDetalhe?.status || "Não informado"}
                    </span>
                </div>

                <div className="pedido-container">
                    <div className="pedido-esquerda">
                        <div className="pedido-card">
                            <div className="pedido-vendedor">
                                Vendido e entregue por: <strong>E-Commerce</strong>
                            </div>

                            {pedidoDetalhe?.itens?.map((item) => (
                                <div
                                    className="produto"
                                    key={item.Id || item.id}
                                >
                                    <div className="produto-info">
                                        <div className="produto-cabecalho">
                                            <img
                                                src={`http://localhost:3000${item.Imagem}`}
                                                alt={item.Nome}
                                            />

                                            <h3>{item.Nome}</h3>
                                        </div>

                                        <p>Quantidade: {item.Quantidade}</p>
                                    </div>

                                    <div className="produto-preco">
                                        R${" "}
                                        {Number(
                                            item.PrecoUnitario || 0
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            ))}

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
                            {etapas.map((etapa, index) => (
                                <React.Fragment key={etapa}>
                                    <div
                                        className={`step ${index <= etapaAtual ? "ativo" : ""
                                            }`}
                                    >
                                        <div className="icone">
                                            {index <= etapaAtual ? "✓" : ""}
                                        </div>

                                        <p>{etapa}</p>
                                    </div>

                                    {index < etapas.length - 1 && (
                                        <div
                                            className={`linha ${index < etapaAtual ? "ativa" : ""
                                                }`}
                                        ></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="pedido-direita">
                        <div className="resumo-card">
                            <h3>
                                Pedido #
                                {String(
                                    pedidoDetalhe?.id ||
                                    pedidoDetalhe?.Id ||
                                    ""
                                ).padStart(5, "0")}
                            </h3>

                            <p>{pedidoDetalhe?.usuario?.nome || ""}</p>

                            <p>
                                {[
                                    pedidoDetalhe?.endereco?.rua,
                                    pedidoDetalhe?.endereco?.numero,
                                    pedidoDetalhe?.endereco?.complemento,
                                    pedidoDetalhe?.endereco?.cidade
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>

                            <hr />

                            <p>
                                Pagamento:{" "}
                                {pedidoDetalhe?.pagamento?.Metodo ||
                                    "Não informado"}
                            </p>

                            <p>
                                Status pagamento:{" "}
                                {pedidoDetalhe?.pagamento?.Status ||
                                    "Não informado"}
                            </p>

                            <hr />

                            <div className="linha-resumo">
                                <span>Produtos</span>

                                <span>
                                    R${" "}
                                    {Number(pedidoDetalhe.itens?.map(item => item.PrecoUnitario)).toFixed(2)}
                                </span>
                            </div>

                            <div className="linha-resumo">
                                <span>Frete</span>
                                <span>{freteValor.toFixed(2)}</span>
                            </div>

                            <div className="linha-resumo total">
                                <span>Total</span>

                                <span>
                                    R${" "}
                                    {Number(
                                        pedidoDetalhe?.total ||
                                        pedidoDetalhe?.Total ||
                                        0
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="acoes">
                            <button onClick={() => avaliarProduto()}>☆ Avaliar Produto</button>
                        </div>

                        <div className="acoes-voltar">
                            <button
                                className="btn-voltar-pedidos"
                                onClick={() => navigate("/meus-pedidos")}
                            >
                                ← Voltar aos meus pedidos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}