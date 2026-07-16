import React, { useEffect, useMemo, useState } from "react";
import { getUsuarios } from "../../../services/usersService";

// Importando o CSS Module ao invés do CSS Global
import styles from "./css/ListaUsuario.module.css";

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                setCarregando(true);
                setErro(null);
                const dados = await getUsuarios();
                setUsuarios(dados);
            } catch (e) {
                setErro("Não foi possível carregar os usuários. Tente novamente.");
            } finally {
                setCarregando(false);
            }
        };

        carregarUsuarios();
    }, []);

    const stats = useMemo(() => {
        const total = usuarios.length;
        const admins = usuarios.filter(u => u.Role?.toLowerCase() === "admin").length;
        const comuns = total - admins;
        const ativos = usuarios.filter(u => u.Ativo).length;
        const inativos = total - ativos;

        return { total, admins, comuns, ativos, inativos };
    }, [usuarios]);

    const usuariosFiltrados = useMemo(() => {
        const termo = pesquisa.toLowerCase();

        return usuarios.filter((usuario) => {
            const atendePesquisa =
                usuario.Nome?.toLowerCase().includes(termo) ||
                usuario.Email?.toLowerCase().includes(termo) ||
                usuario.Username?.toLowerCase().includes(termo);

            const statusUsuario = usuario.Ativo ? "ativo" : "inativo";

            const atendeFiltroTipo = filtroTipo ? usuario.Role === filtroTipo : true;
            const atendeFiltroStatus = filtroStatus ? statusUsuario === filtroStatus : true;

            return atendePesquisa && atendeFiltroTipo && atendeFiltroStatus;
        });
    }, [usuarios, pesquisa, filtroTipo, filtroStatus]);

    const iniciais = (nome = "") =>
        nome
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((parte) => parte[0]?.toUpperCase())
            .join("");

    const handleEditar = (usuario) => {
        console.log(`Editar usuário ${usuario.Id}`);
    };

    const handleDesativar = (usuario) => {
        console.log(`Desativar usuário ${usuario.Id}`);
    };

    return (
        <div className={`${styles.container} p-4 d-flex flex-column gap-4 text-white`}>

            {/* CABEÇALHO COM CARDS DE ESTATÍSTICAS */}
            <div className={`${styles.headerCard} p-4`}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start s gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Lista De Usuários</h2>
                        <p className={`${styles.subtitulo} mb-0`}>
                            Gerencie os membros da sua organização e suas permissões de acesso.
                        </p>
                    </div>
                    <button className={`${styles.btnPrimary} btn d-flex align-items-center gap-2 px-4 py-2`}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo Usuário</span>
                    </button>
                </div>

                <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-5">
                    <div className="col">
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Total</span>
                            <span className={styles.statValue}>{stats.total}</span>
                        </div>
                    </div>
                    <div className="col">
                        <div className={styles.statItem}>
                            <span className={`${styles.statLabel} text-info`}>Admins</span>
                            <span className={styles.statValue}>{stats.admins}</span>
                        </div>
                    </div>
                    <div className="col">
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Usuários</span>
                            <span className={styles.statValue}>{stats.comuns}</span>
                        </div>
                    </div>
                    <div className="col">
                        <div className={styles.statItem}>
                            <span className={`${styles.statLabel} text-success`}>Ativos</span>
                            <span className={styles.statValue}>{stats.ativos}</span>
                        </div>
                    </div>
                    <div className="col">
                        <div className={styles.statItem}>
                            <span className={`${styles.statLabel} text-danger`}>Inativos</span>
                            <span className={styles.statValue}>{stats.inativos}</span>
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
                                placeholder="Buscar por nome, email ou username..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-6 col-md-3 col-lg-3">
                        <select
                            className={`${styles.select} form-select`}
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="">Todos os Tipos</option>
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>


                    <div className="col-6 col-md-3 col-lg-3">
                        <select
                            className={`${styles.select} form-select`}
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="">Todos os Status</option>
                            <option value="ativo">Ativos</option>
                            <option value="inativo">Inativos</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* TABELA DE USUÁRIOS */}
            <div className={styles.tableCard}>
                {carregando ? (
                    <div className="text-center py-5 text-secondary">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Carregando usuários...
                    </div>
                ) : erro ? (
                    <div className="text-center py-5 text-danger">{erro}</div>
                ) : (
                    <div className="table-responsive">
                        <table className={`${styles.table} table table-borderless mb-0 align-middle`}>
                            <thead>
                                <tr className={styles.thead}>
                                    <th className="p-3 ps-4 fw-normal" style={{ width: "80px" }}>ID</th>
                                    <th className="p-3 fw-normal">Usuário</th>
                                    <th className="p-3 fw-normal">Tipo</th>
                                    <th className="p-3 fw-normal">Status</th>
                                    <th className="p-3 pe-4 fw-normal text-end" style={{ width: "120px" }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.length > 0 ? (
                                    usuariosFiltrados.map((usuario) => (
                                        <tr key={usuario.Id} className={styles.row}>
                                            <td className={`p-3 ps-4 ${styles.muted}`}>{usuario.Id}</td>
                                            <td className="p-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`${styles.avatar} d-flex align-items-center justify-content-center fw-bold`}>
                                                        {iniciais(usuario.Nome)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold text-white">{usuario.Nome}</div>
                                                        {usuario.Email && (
                                                            <div className={styles.email}>
                                                                {usuario.Email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={styles.badgeTipo}>
                                                    {usuario.Role?.toUpperCase() || 'USER'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span
                                                    className={`${styles.badgeStatus} d-inline-flex align-items-center gap-1.5 ${usuario.Ativo
                                                        ? "bg-success-subtle text-success"
                                                        : "bg-danger-subtle text-danger"
                                                        }`}
                                                >
                                                    <span className={`${styles.statusDot} ${usuario.Ativo ? "bg-success" : "bg-danger"}`}></span>
                                                    {usuario.Ativo ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td className="p-3 pe-4 text-end">
                                                <div className={styles.acoes}>
                                                    <button
                                                        className={`${styles.btnAction} btn me-2`}
                                                        title="Editar"
                                                        onClick={() => handleEditar(usuario)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className={`${styles.btnAction} btn text-danger`}
                                                        title="Desativar"
                                                        onClick={() => handleDesativar(usuario)}
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-secondary">
                                            <i className="bi bi-person-x fs-2 d-block mb-2"></i>
                                            Nenhum usuário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaUsuario;