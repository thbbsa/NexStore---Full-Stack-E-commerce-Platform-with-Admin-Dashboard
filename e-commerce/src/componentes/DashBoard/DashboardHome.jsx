import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
    return (
        <div className="container-fluid py-4">

            {/* ===== CARDS TOPO ===== */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Vendas</h6>
                            <h3 className="fw-bold">R$ 12.450</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Pedidos</h6>
                            <h3 className="fw-bold">128</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Usuários</h6>
                            <h3 className="fw-bold">84</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Produtos</h6>
                            <h3 className="fw-bold">56</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== GRÁFICO + ATIVIDADES ===== */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm h-100">
                        <div className="card-header fw-semibold">
                            Vendas nos últimos 7 dias
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center text-muted">
                            Gráfico em desenvolvimento
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header fw-semibold">
                            Atividades recentes
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">✔ Produto atualizado</li>
                            <li className="list-group-item">✔ Pedido #1023 criado</li>
                            <li className="list-group-item">✔ Usuário cadastrado</li>
                            <li className="list-group-item">✔ Produto removido</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ===== PEDIDOS RECENTES ===== */}
            <div className="card shadow-sm mb-4">
                <div className="card-header fw-semibold">
                    Pedidos recentes
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1023</td>
                                <td>João Silva</td>
                                <td><span className="badge bg-warning">Pendente</span></td>
                                <td>R$ 320</td>
                                <td>10/01</td>
                            </tr>
                            <tr>
                                <td>1022</td>
                                <td>Maria Souza</td>
                                <td><span className="badge bg-success">Pago</span></td>
                                <td>R$ 180</td>
                                <td>09/01</td>
                            </tr>
                            <tr>
                                <td>1021</td>
                                <td>Carlos Lima</td>
                                <td><span className="badge bg-danger">Cancelado</span></td>
                                <td>R$ 90</td>
                                <td>08/01</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== ALERTAS ===== */}
            <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                    Alertas do sistema
                </div>
                <div className="card-body">
                    <div className="alert alert-warning mb-2">
                        ⚠ 3 produtos sem imagem cadastrada
                    </div>
                    <div className="alert alert-danger mb-0">
                        ⚠ 2 pedidos pendentes há mais de 48h
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Dashboard;
