import React from "react";
import './CheckoutConcluido.css'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function CheckoutConcluido() {
    const { pedidoId } = useParams();
    const navigate = useNavigate();

    async function verDetalhePedido() {
        await new Promise(resolve => setTimeout(resolve, 3000))
        navigate(`/detalhe-pedido/${pedidoId}`)
    }

    return (
        <div className="ck-page">
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