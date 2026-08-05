import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarios } from "../../../services/usersService";

// Importando o CSS Module ao invés do CSS Global
import styles from "./css/ListaUsuario.module.css";

import ModalConfirmacaoExclusao from "../../ModalConfirmacaoExclusao/ModalConfirmacaoExclusao";
import { excluirUsuario } from "../../../services/userService.js";

const MSIcon = ({ name, size = 17, fill = 0, wght = 400 }) => (
    <span
        className="ms"
        style={{
            fontSize: size,
            fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' 0, 'opsz' 20`,
        }}
    >
        {name}
    </span>
);

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [form, setForm] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [messageError, setMessageError] = useState("");
    const navigate = useNavigate()

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
        navigate(`/dashboard/usuarios/editar/${usuario.Id}`)
    };
    const handleExcluirUsuario = async (usuario) => {
        try {
            const res = await excluirUsuario(form.Id);
            const data = await res.json();

            if (!res.ok) {
                mostrarMensagemErro(data.message);
                return;
            }

            // Remove o usuário excluído da lista local
            setUsuarios((prev) => prev.filter((u) => u.Id !== form.Id));

            setModalExclusaoAberto(false);
            mostrarMensagemSucesso(`Usuário excluído com sucesso!`);
        } catch (error) {
            console.error(error);
            mostrarMensagemErro();
        }
    };

    const mostrarMensagemSucesso = (msg) => {
        setMessageSuccess(msg);
        setShowMessage(true);

        setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    };

    const mostrarMensagemErro = (msg) => {
        setMessageError(msg || "Ocorreu um erro. Tente novamente.");
        setShowErrorMessage(true);

        setTimeout(() => {
            setShowErrorMessage(false);
        }, 5000);
    };

    return (
        <div className={`${styles.container} p-4 d-flex flex-column gap-4 text-white`}>

            {/* Mensagens de feedback */}

            <div className={styles.containerMensagem}>
                <div className={`${styles.mensagemSucesso} ${showMessage ? styles.show : ""}`}>
                    <MSIcon name="check" size={16} fill={1} />
                    <span>{messageSuccess}</span>
                </div>

                <div className={`${styles.mensagemErro} ${showErrorMessage ? styles.show : ""}`} style={{ marginTop: showMessage ? "10px" : 0 }}>
                    <MSIcon name="error" size={16} fill={1} />
                    <span>{messageError}</span>
                </div>
            </div>

            {/* CABEÇALHO COM CARDS DE ESTATÍSTICAS */}
            <div className={`${styles.headerCard} p-4`}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start s gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Lista De Usuários</h2>
                        <p className={`${styles.subtitulo} mb-0`}>
                            Gerencie os membros da sua organização e suas permissões de acesso.
                        </p>
                    </div>
                    <button className={`${styles.btnPrimary} btn d-flex align-items-center gap-2 px-4 py-2`}
                        onClick={() => navigate('/dashboard/usuarios/criar-novo')}>
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
                                                        onClick={() => {
                                                            setForm(usuario);
                                                            setModalExclusaoAberto(true);
                                                        }}
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


            {modalExclusaoAberto && (
                <ModalConfirmacaoExclusao
                    nomeAlvo={form.Nome}
                    onClose={() => setModalExclusaoAberto(false)}
                    onConfirmar={handleExcluirUsuario}
                />
            )}
        </div>
    );
};

export default ListaUsuario;