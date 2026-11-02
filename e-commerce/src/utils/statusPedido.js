import styles from "../componentes/DashBoard/Pedidos/css/Pedidos.module.css";

export const badgeClass = styles.badge;

export const statusMap = {
    preparando: { label: "Preparando", className: styles.badgePendente },
    enviado: { label: "Enviado", className: styles.badgeEnviado },
    emtransito: { label: "Em trânsito", className: styles.badgeTransito },
    entregue: { label: "Entregue", className: styles.badgeEntregue },
    devolvido: { label: "Devolvido", className: styles.badgePendente },
};

export const pagamentoMap = {
    aprovado: { label: "Pago", className: styles.badgePago },
    pendente: { label: "Aguardando pagamento", className: styles.badgePendente },
};

export const normalizarStatus = (valor) =>
    valor
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || "";

        