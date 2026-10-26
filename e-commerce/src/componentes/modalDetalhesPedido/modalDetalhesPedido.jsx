import { React, useState, useEffect } from 'react'
import styles from './css/modalDetalhesPedido.module.css'
import { getPedido } from '../../services/userService'

const ModalDetalhesPedido = (props) => {

    const handleCardClick = (e) => e.stopPropagation()

    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatarMoeda = (valor) =>
        (valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    useEffect(() => {
        const carregarPedido = async () => {
            try {
                const pedidoData = await getPedido(props.pedidoId);
                setPedido(pedidoData.pedidoDetalhe);
            } catch (error) {
                setError('Erro ao carregar os detalhes do pedido.');
            } finally {
                setLoading(false);
            }
        }

        carregarPedido();
    }, [props.pedidoId])


    return (
        <div className={styles.overlay} onClick={props.onClose}>
            {loading ? (
                <div className={styles.card} onClick={handleCardClick}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    Carregando detalhes do pedido...
                </div>
            ) : error ? (
                <div className={styles.card} onClick={handleCardClick}>
                    <div className="text-danger">{error}</div>
                </div>
            ) : (
                <div className={styles.modalCard} onClick={handleCardClick}>

                    {/* Header */}
                    <div className={styles.modalHeader}>
                        <div className={styles.modalHeaderContent}>
                            <h2 className={styles.modalTitle}>Pedido</h2>
                            <h1 className={styles.modalId}>#{pedido?.id}</h1>
                        </div>
                        <button type="button" className={styles.btnFechar} onClick={props.onClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className={styles.modalBody}>
                        <div className="row g-4">

                            {/* Cliente */}
                            <div className="col-12 col-md-6">
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>Cliente</h3>
                                    <div className={styles.clienteInfo}>
                                        <div className={styles.avatar}>UE</div>
                                        <div>
                                            <p className={styles.modalSectionContent}>{pedido?.usuario?.nome}</p>
                                            <p className={styles.modalSectionContentMuted}>{pedido?.usuario?.email} #{pedido?.usuario?.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pagamento */}
                            <div className="col-12 col-md-6">
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>Informações do Pagamento</h3>
                                    <p className={styles.modalSectionContent}><strong>Método:</strong> {pedido?.pagamento?.metodo}</p>
                                    <p className={styles.modalSectionContent}>
                                        <strong>Status:</strong>{' '}
                                        <span className={styles.badgeSuccess}>● Pago</span>
                                    </p>
                                </div>
                            </div>

                            {/* Itens do pedido */}
                            <div className="col-12">
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>Itens do Pedido</h3>
                                    <div className={styles.itemsList}>
                                        {pedido?.itens?.map((item) => (
                                            <div className={styles.itemRow} key={item.id}>
                                                <div>
                                                    <p className={styles.itemName}>{item.nome}</p>
                                                    <p className={styles.itemQty}>
                                                        Qtd: {item.quantidade} × {formatarMoeda(item.precoUnitario)}
                                                    </p>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {formatarMoeda(item.subtotal ?? item.quantidade * item.precoUnitario)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className={styles.itemRowTotal}>
                                            <span>Total</span>
                                            <span className={styles.totalValue}>{formatarMoeda(pedido?.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-12">
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>Status do Pedido</h3>
                                    <span className={styles.badgeWarning}>● {pedido?.status}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnSecundario} onClick={props.onClose}>
                            Fechar
                        </button>
                        <button
                            type="button"
                            className={styles.btnPrimario}
                            onClick={props.onAvancar}
                            disabled={
                                props.avancando ||
                                pedido?.status === "Entregue" ||
                                pedido?.status === "Cancelado"
                            }
                        >
                            {props.avancando ? "Avançando..." : "Avançar status →"}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default ModalDetalhesPedido