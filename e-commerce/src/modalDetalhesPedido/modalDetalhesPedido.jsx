import React from 'react'
import styles from './css/modalDetalhesPedido.module.css'

const ModalDetalhesPedido = (props) => {
    // impede que o clique dentro do card feche o modal
    const handleCardClick = (e) => e.stopPropagation()

    return (
        <div className={styles.overlay} onClick={props.onClose}>
            <div className={styles.modalCard} onClick={handleCardClick}>

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderContent}>
                        <h2 className={styles.modalTitle}>Pedido</h2>
                        <h1 className={styles.modalId}>#7</h1>
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
                                        <p className={styles.modalSectionContent}>João da Silva</p>
                                        <p className={styles.modalSectionContentMuted}>joao.silva@example.com #6</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagamento */}
                        <div className="col-12 col-md-6">
                            <div className={styles.modalSection}>
                                <h3 className={styles.modalSectionTitle}>Informações do Pagamento</h3>
                                <p className={styles.modalSectionContent}><strong>Método:</strong> Cartão de Crédito</p>
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
                                    <div className={styles.itemRow}>
                                        <div>
                                            <p className={styles.itemName}>Kit Ergonômico Pro</p>
                                            <p className={styles.itemQty}>Qtd: 1 × R$ 899,00</p>
                                        </div>
                                        <span className={styles.itemPrice}>R$ 899,00</span>
                                    </div>
                                    <div className={styles.itemRow}>
                                        <div>
                                            <p className={styles.itemName}>Suporte para Monitor</p>
                                            <p className={styles.itemQty}>Qtd: 1 × R$ 250,00</p>
                                        </div>
                                        <span className={styles.itemPrice}>R$ 250,00</span>
                                    </div>
                                    <div className={styles.itemRowTotal}>
                                        <span>Total</span>
                                        <span className={styles.totalValue}>R$ 1.299,00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-12">
                            <div className={styles.modalSection}>
                                <h3 className={styles.modalSectionTitle}>Status do Pedido</h3>
                                <span className={styles.badgeWarning}>● Preparando</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button type="button" className={styles.btnSecundario} onClick={props.onClose}>
                        Fechar
                    </button>
                    <button type="button" className={styles.btnPrimario}>
                        Avançar status →
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ModalDetalhesPedido