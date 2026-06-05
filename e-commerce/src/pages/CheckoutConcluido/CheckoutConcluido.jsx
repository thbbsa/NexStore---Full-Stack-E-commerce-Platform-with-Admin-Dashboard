import React, { useState } from "react";
import './CheckoutConcluido.css'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

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

export default function CheckoutConcluido() {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const [messageSuccess, setMessageSuccess] = useState("")

    async function verDetalhePedido() {
        setMessageSuccess("Você será redirecionado em 3 segundos")
        await new Promise(resolve => setTimeout(resolve, 3000))
        navigate(`/detalhe-pedido/${pedidoId}`)
    }

    return (
        <div className="ck-page">

            <div className="ck-message-success-wrap">
                <div className={`ck-success-message ${messageSuccess ? "show" : ""}`}>
                    <MSIcon name="check" size={16} fill={1} />
                    <span>{messageSuccess || "Sucesso"}</span>
                </div>
            </div>

            <div className="ck-finish-page">

                <div className="ck-finish-card">

                    <div className="ck-finish-header">
                        <h1 className="ck-finish-title">
                            <div className="ck-finish-icon">✓</div>
                            <span>Pedido realizado com sucesso!</span>
                        </h1>

                        <h2 className="ck-finish-subtitle">
                            Estamos confirmando o seu pagamento
                        </h2>
                    </div>

                    <div className="ck-finish-divider"></div>

                    <div className="ck-finish-body">
                        <p className="ck-finish-order">
                            Número do pedido:
                            <strong> #{String(pedidoId).padStart(5, "0")}</strong>
                        </p>

                        <button className="ck-btn-next" onClick={() => verDetalhePedido()}>
                            Ver detalhes do pedido
                        </button>

                        <p className="ck-finish-redirect">
                            Você será redirecionado em 3 segundos
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}