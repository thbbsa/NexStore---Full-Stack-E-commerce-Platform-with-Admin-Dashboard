import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Importação do estilo modularizado e ergonômico
import styles from "./css/dashboard.module.css"; 

const Dashboard = () => {
    return (
        <div className={`${styles.containerDashboard} container-fluid py-4`}>

            {/* ===== CARDS TOPO ===== */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className={`${styles.cardCustom} card`}>
                        <div className="card-body">
                            <h6 className={styles.textMutedCustom}>Vendas</h6>
                            <h3 className={`${styles.textMainCustom} fw-bold m-0`}>R$ 12.450</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className={`${styles.cardCustom} card`}>
                        <div className="card-body">
                            <h6 className={styles.textMutedCustom}>Pedidos</h6>
                            <h3 className={`${styles.textMainCustom} fw-bold m-0`}>128</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className={`${styles.cardCustom} card`}>
                        <div className="card-body">
                            <h6 className={styles.textMutedCustom}>Usuários</h6>
                            <h3 className={`${styles.textMainCustom} fw-bold m-0`}>84</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className={`${styles.cardCustom} card`}>
                        <div className="card-body">
                            <h6 className={styles.textMutedCustom}>Produtos</h6>
                            <h3 className={`${styles.textMainCustom} fw-bold m-0`}>56</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== GRÁFICO + ATIVIDADES ===== */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className={`${styles.cardCustom} card h-100`}>
                        <div className={`${styles.cardHeaderCustom} card-header`}>
                            Vendas nos últimos 7 dias
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <span className={styles.textMutedCustom}>Gráfico em desenvolvimento</span>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className={`${styles.cardCustom} card h-100`}>
                        <div className={`${styles.cardHeaderCustom} card-header`}>
                            Atividades recentes
                        </div>
                        <ul className="list-group list-group-flush bg-transparent">
                            <li className={`${styles.listItemCustom} list-group-item`}>✔ Produto atualizado</li>
                            <li className={`${styles.listItemCustom} list-group-item`}>✔ Pedido #1023 criado</li>
                            <li className={`${styles.listItemCustom} list-group-item`}>✔ Usuário cadastrado</li>
                            <li className={`${styles.listItemCustom} list-group-item`}>✔ Produto removido</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ===== PEDIDOS RECENTES ===== */}
            <div className={`${styles.cardCustom} card mb-4`}>
                <div className={`${styles.cardHeaderCustom} card-header`}>
                    Pedidos recentes
                </div>
                <div className="table-responsive">
                    <table className={`${styles.tableCustom} table align-middle mb-0`}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.tableRowHover}>
                                <td>1023</td>
                                <td>João Silva</td>
                                <td><span className={`${styles.badgeWarning} badge`}>Pendente</span></td>
                                <td>R$ 320</td>
                                <td>10/01</td>
                            </tr>
                            <tr className={styles.tableRowHover}>
                                <td>1022</td>
                                <td>Maria Souza</td>
                                <td><span className={`${styles.badgeSuccess} badge`}>Pago</span></td>
                                <td>R$ 180</td>
                                <td>09/01</td>
                            </tr>
                            <tr className={styles.tableRowHover}>
                                <td>1021</td>
                                <td>Carlos Lima</td>
                                <td><span className={`${styles.badgeDanger} badge`}>Cancelado</span></td>
                                <td>R$ 90</td>
                                <td>08/01</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== ALERTAS ===== */}
            <div className={`${styles.cardCustom} card`}>
                <div className={`${styles.cardHeaderCustom} card-header`}>
                    Alertas do sistema
                </div>
                <div className="card-body">
                    <div className={`${styles.alertWarningCustom} alert mb-2 py-2 px-3`}>
                        ⚠ 3 produtos sem imagem cadastrada
                    </div>
                    <div className={`${styles.alertDangerCustom} alert mb-0 py-2 px-3`}>
                        ⚠ 2 pedidos pendentes há mais de 48h
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;