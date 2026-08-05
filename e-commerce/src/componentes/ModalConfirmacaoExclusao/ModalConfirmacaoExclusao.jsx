import React, { useState } from "react";
import styles from "./css/ModalConfirmacaoExclusao.module.css";


const ModalConfirmacaoExclusao = ({
    titulo = "Confirmar exclusão",
    mensagem,
    nomeAlvo,
    onClose,
    onConfirmar,
}) => {
    const [confirmText, setConfirmText] = useState("");
    const [excluindo, setExcluindo] = useState(false);

    const podeConfirmar = confirmText.trim().toUpperCase() === "EXCLUIR";

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleConfirmar = async () => {
        if (!podeConfirmar || excluindo) return;

        setExcluindo(true);
        try {
            await onConfirmar();
        } finally {
            setExcluindo(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modalCard}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        <span className="material-symbols-outlined fs-5">warning</span>
                        {titulo}
                    </h3>
                    <button type="button" className={styles.btnFechar} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.textoAviso}>
                        {mensagem || (
                            <>
                                Esta ação é <strong>irreversível</strong>. Os dados pessoais de{" "}
                                <strong>{nomeAlvo}</strong> (nome, email, telefone e CPF) serão
                                permanentemente anonimizados. O histórico de pedidos será mantido,
                                mas a conta não poderá mais ser acessada.
                            </>
                        )}
                    </p>

                    <label className={styles.labelCustom} htmlFor="confirmText">
                        Digite <strong>EXCLUIR</strong> para confirmar
                    </label>
                    <input
                        id="confirmText"
                        type="text"
                        className={styles.inputCustom}
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="EXCLUIR"
                        autoComplete="off"
                    />
                </div>

                <div className={styles.modalFooter}>
                    <button type="button" className={styles.btnSecondary} onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.btnDanger}
                        disabled={!podeConfirmar || excluindo}
                        onClick={handleConfirmar}
                    >
                        {excluindo ? "Excluindo..." : "Excluir usuário"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacaoExclusao;