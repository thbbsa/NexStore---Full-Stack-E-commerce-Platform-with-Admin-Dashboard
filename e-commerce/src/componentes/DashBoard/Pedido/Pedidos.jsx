import { React, useState, useEffect } from "react";
import styles from "./css/Pedidos.module.css";
import { getPedidosStats, getPedidosInfo } from "../../../services/pedidoService";

const statusMap = {
    pendente: { label: "Pendente", className: styles.badgePendente },
    preparando: { label: "Preparando", className: styles.badgePendente },
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
        ?.split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "";

// remove acentos e deixa minúsculo, ex: "Em Trânsito" -> "em transito"
const normalizarStatus = (valor) =>
    valor
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || "";

const Pedido = () => {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [stats, setStats] = useState(null);
    const [pedidosInfo, setPedidosInfo] = useState(null);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroPagamento, setFiltroPagamento] = useState("");
    const [filtroData, setFiltroData] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            setCarregando(true);
            setErro(null);

            try {
                const response = await getPedidosStats();
                setCarregando(false);
                setStats(response.stats);
            } catch (error) {
                setErro("Erro ao carregar estatísticas de pedidos.");
                setCarregando(false);
            }
        };

        const loadPedidosInfo = async () => {
            setCarregando(true);
            setErro(null);

            try {
                const pedidosInfo = await getPedidosInfo();

                const pedidosFormatados = pedidosInfo.info.map((p) => ({
                    id: p.PedidoId,
                    nome: p.UsuarioNome,
                    email: p.UsuarioEmail,
                    dataRaw: new Date(p.DataPedido),
                    data: new Date(p.DataPedido).toLocaleString("pt-BR"),
                    total: p.Total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                    pagamento: normalizarStatus(p.StatusPagamento),
                    status: normalizarStatus(p.StatusEntrega),
                }));

                setPedidosInfo(pedidosFormatados);
                setCarregando(false);
            } catch (error) {
                setErro("Erro ao carregar informações de pedidos.");
                setCarregando(false);
            }
        };

        loadPedidosInfo();
        loadStats();
    }, []);

    const filteredPedidos = pedidosInfo?.filter((pedido) => {
        const pesquisaLower = pesquisa.toLowerCase();
        const pesquisaEncontrada = pedido.nome.toLowerCase().includes(pesquisaLower) || pedido.id.toString().includes(pesquisaLower);
        const statusMatch = !filtroStatus || pedido.status === filtroStatus;
        const pagamentoMatch = !filtroPagamento || pedido.pagamento === filtroPagamento;
        const dataMatch =
            !filtroData ||
            (filtroData === "7dias" && pedido.dataRaw >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
            (filtroData === "30dias" && pedido.dataRaw >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

        return pesquisaEncontrada && statusMatch && pagamentoMatch && dataMatch;
    });



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
                                <p className={styles.statValue}>{stats?.TotalPedidos || 142}</p>
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
                                <p className={styles.statValue}>
                                    R$ {stats?.TotalVendas?.toLocaleString("pt-BR") || "18.450,00"}
                                </p>
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
                                <p className={styles.statValue}>{stats?.AguardandoPagamento}</p>
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
                                <p className={styles.statValue}>{stats?.ParaEnviar}</p>
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
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <select className={`${styles.select} form-select`} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="">Status: Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="enviado">Enviado</option>
                            <option value="transito">Em trânsito</option>
                            <option value="entregue">Entregue</option>
                        </select>
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <select className={`${styles.select} form-select`} onChange={(e) => setFiltroPagamento(e.target.value)}>
                            <option value="">Pagamento: Todos</option>
                            <option value="pago">Pago</option>
                            <option value="pendente">Aguardando pagamento</option>
                        </select>
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <select className={`${styles.select} form-select`} onChange={(e) => setFiltroData(e.target.value)}>
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
                        <div
                            className="spinner-border spinner-border-sm me-2 text-primary"
                            role="status"
                        ></div>
                        Carregando pedidos...
                    </div>
                ) : erro ? (
                    <div className="text-center py-5 text-danger">{erro}</div>
                ) : (
                    <div className="table-responsive">
                        <table className={`${styles.table} table table-borderless mb-0 align-middle`}>
                            <thead>
                                <tr className={styles.thead}>
                                    <th className="p-3 ps-4 fw-normal" style={{ width: "80px" }}>
                                        ID
                                    </th>
                                    <th className="p-3 fw-normal">Cliente</th>
                                    <th className="p-3 fw-normal">Data / Hora</th>
                                    <th className="p-3 fw-normal">Total</th>
                                    <th className="p-3 fw-normal">Pagamento</th>
                                    <th className="p-3 fw-normal">Status</th>
                                    <th
                                        className="p-3 pe-4 fw-normal text-end"
                                        style={{ width: "140px" }}
                                    >
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPedidos?.map((pedido) => {
                                    const status = statusMap[pedido.status] ?? {
                                        label: pedido.status || "—",
                                        className: "",
                                    };
                                    const pagamento = pagamentoMap[pedido.pagamento] ?? {
                                        label: pedido.pagamento || "—",
                                        className: "",
                                    };

                                    return (
                                        <tr key={pedido.id} className={styles.row}>
                                            <td className={`p-3 ps-4 ${styles.muted}`}>#{pedido.id}</td>
                                            <td className="p-3">
                                                <div className={styles.clienteCell}>
                                                    <div className={styles.avatar}>
                                                        {getIniciais(pedido.nome)}
                                                    </div>
                                                    <div className={styles.clienteInfo}>
                                                        <span className={styles.clienteNome}>
                                                            {pedido.nome}
                                                        </span>
                                                        <span className={styles.clienteEmail}>
                                                            {pedido.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`p-3 ${styles.muted}`}>{pedido.data}</td>
                                            <td className={`p-3 ${styles.total}`}>{pedido.total}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`${styles.badge} ${pagamento.className}`}
                                                >
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