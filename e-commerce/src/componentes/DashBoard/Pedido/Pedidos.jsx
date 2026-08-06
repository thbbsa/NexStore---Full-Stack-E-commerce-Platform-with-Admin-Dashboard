import { React, useState } from "react";
import styles from "./css/Pedidos.module.css";

const pedidosMock = [
    {
        id: 12345,
        nome: "John Doe",
        email: "john.doe@email.com",
        data: "15/06/2023 14:30",
        total: "R$ 150,00",
        pagamento: "pago",
        status: "entregue",
    },
    {
        id: 12346,
        nome: "Maria Oliveira",
        email: "maria.oliveira@email.com",
        data: "05/08/2026 11:20",
        total: "R$ 890,00",
        pagamento: "pago",
        status: "enviado",
    },
    {
        id: 12347,
        nome: "Carlos Souza",
        email: "carlos.souza@email.com",
        data: "05/08/2026 13:45",
        total: "R$ 120,50",
        pagamento: "pendente",
        status: "confirmado",
    },
];

const statusMap = {
    pendente: { label: "Pendente", className: styles.badgePendente },
    confirmado: { label: "Confirmado", className: styles.badgeConfirmado },
    enviado: { label: "Enviado", className: styles.badgeEnviado },
    transito: { label: "Em trânsito", className: styles.badgeTransito },
    entregue: { label: "Entregue", className: styles.badgeEntregue },
};

const pagamentoMap = {
    pago: { label: "Pago", className: styles.badgePago },
    pendente: { label: "Aguardando pagamento", className: styles.badgePendente },
};

const getIniciais = (nome) =>
    nome
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const Pedido = () => {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    return (
        <div className={`${styles.pedidoContainer} p-4 d-flex flex-column gap-4 text-white`}>
            <div className={`${styles.headerCard} p-4`}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Lista de Pedidos</h2>
                        <p className={`${styles.subtitulo} mb-0`}>
                            Acompanhe todos os pedidos e seus status de entrega.
                        </p>
                    </div>
                </div>

                <div className="d-flex justify-content-between row row-cols-2 row-cols-md-3 row-cols-lg-5 gap-3 p-3">
                    <div className="col">
                        <div className={styles.statItem} style={{ "--stat-color": "#3b82f6" }}>
                            <div className={styles.statIcon}>
                                <i className="bi bi-bag-check"></i>
                            </div>
                            <div className={styles.statBody}>
                                <h5 className={styles.statLabel}>Total pedidos</h5>
                                <p className={styles.statValue}>142</p>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className={styles.statItem} style={{ "--stat-color": "#22c55e" }}>
                            <div className={styles.statIcon}>
                                <i className="bi bi-currency-dollar"></i>
                            </div>
                            <div className={styles.statBody}>
                                <h5 className={styles.statLabel}>Faturamento</h5>
                                <p className={styles.statValue}>R$ 18.450,00</p>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className={styles.statItem} style={{ "--stat-color": "#f59e0b" }}>
                            <div className={styles.statIcon}>
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                            <div className={styles.statBody}>
                                <h5 className={styles.statLabel}>Aguardando pagamento</h5>
                                <p className={styles.statValue}>12</p>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className={styles.statItem} style={{ "--stat-color": "#6d5bf7" }}>
                            <div className={styles.statIcon}>
                                <i className="bi bi-truck"></i>
                            </div>
                            <div className={styles.statBody}>
                                <h5 className={styles.statLabel}>Para enviar</h5>
                                <p className={styles.statValue}>8</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTROS UNIFICADOS EM CARD */}
            <div className={`${styles.filtersCard} p-3`}>
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className={styles.inputGroup}>
                            <span className="ps-3 text-secondary">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por ID ou cliente..."
                            />
                        </div>
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <select className={`${styles.select} form-select`}>
                            <option value="">Status: Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="enviado">Enviado</option>
                            <option value="transito">Em trânsito</option>
                            <option value="entregue">Entregue</option>
                        </select>
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <select className={`${styles.select} form-select`}>
                            <option value="">Pagamento: Todos</option>
                            <option value="pago">Pago</option>
                            <option value="pendente">Aguardando pagamento</option>
                        </select>
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <select className={`${styles.select} form-select`}>
                            <option value="">Data: Hoje</option>
                            <option value="7dias">Últimos 7 dias</option>
                            <option value="30dias">Últimos 30 dias</option>
                            <option value="personalizado">Personalizado</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={`${styles.tableCard} p-4`}>
                {carregando ? (
                    <div className="text-center py-5 text-secondary">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Carregando pedidos...
                    </div>
                ) : erro ? (
                    <div className="text-center py-5 text-danger">{erro}</div>
                ) : (
                    <div className="table-responsive">
                        <table className={`${styles.table} table table-borderless mb-0 align-middle`}>
                            <thead>
                                <tr className={styles.thead}>
                                    <th className="p-3 ps-4 fw-normal" style={{ width: "80px" }}>ID</th>
                                    <th className="p-3 fw-normal">Cliente</th>
                                    <th className="p-3 fw-normal">Data / Hora</th>
                                    <th className="p-3 fw-normal">Total</th>
                                    <th className="p-3 fw-normal">Pagamento</th>
                                    <th className="p-3 fw-normal">Status</th>
                                    <th className="p-3 pe-4 fw-normal text-end" style={{ width: "140px" }}>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pedidosMock.map((pedido) => {
                                    const status = statusMap[pedido.status];
                                    const pagamento = pagamentoMap[pedido.pagamento];

                                    return (
                                        <tr key={pedido.id} className={styles.row}>
                                            <td className={`p-3 ps-4 ${styles.muted}`}>#{pedido.id}</td>
                                            <td className="p-3">
                                                <div className={styles.clienteCell}>
                                                    <div className={styles.avatar}>{getIniciais(pedido.nome)}</div>
                                                    <div className={styles.clienteInfo}>
                                                        <span className={styles.clienteNome}>{pedido.nome}</span>
                                                        <span className={styles.clienteEmail}>{pedido.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`p-3 ${styles.muted}`}>{pedido.data}</td>
                                            <td className={`p-3 ${styles.total}`}>{pedido.total}</td>
                                            <td className="p-3">
                                                <span className={`${styles.badge} ${pagamento.className}`}>
                                                    {pagamento.label}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`${styles.badge} ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="p-3 pe-4 text-end">
                                                <button className={styles.btnVer}>
                                                    <i className="bi bi-eye"></i>
                                                    Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pedido;