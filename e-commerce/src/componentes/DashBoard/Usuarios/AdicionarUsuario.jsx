import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/AdicionarUsuario.module.css";
import { storeUser } from "../../../services/userService.js";
import { formatarTelefone, formatarCpf } from "../../../utils/formatters.js";

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

const AdicionarUsuario = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        username: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: "",
        role: "user", 
    });

    const [messageSuccess, setMessageSuccess] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const [messageError, setMessageError] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);


    const apenasNumeros = (val = "") => val.replace(/\D/g, "");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "telefone" || name === "cpf") {
            setForm((prev) => ({ ...prev, [name]: apenasNumeros(value) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const iniciais = (nome = "") =>
        nome
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((parte) => parte[0]?.toUpperCase())
            .join("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Garante que o payload enviado para a API contenha apenas números no telefone e CPF
        const payload = {
            ...form,
            telefone: apenasNumeros(form.telefone),
            cpf: apenasNumeros(form.cpf),
        };

        const response = await storeUser(payload);

        if (response.ok) {
            setForm({
                nome: "",
                username: "",
                email: "",
                telefone: "",
                cpf: "",
                senha: "",
                role: "user",
            });
            mostrarMensagemSucesso("Usuário adicionado com sucesso!");
        } else {
            mostrarMensagemErro("Erro ao adicionar usuário.");
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
        <div className={`${styles.containerUsuario} container-fluid p-4`}>
            {/* Mensagens de feedback */}
            <div className={styles.containerMensagem}>
                <div className={`${styles.mensagemSucesso} ${showMessage ? styles.show : ""}`}>
                    <MSIcon name="check" size={16} fill={1} />
                    <span>{messageSuccess}</span>
                </div>

                <div
                    className={`${styles.mensagemErro} ${showErrorMessage ? styles.show : ""}`}
                    style={{ marginTop: showMessage ? "10px" : 0 }}
                >
                    <MSIcon name="error" size={16} fill={1} />
                    <span>{messageError}</span>
                </div>
            </div>

            {/* Topo da página */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h2 className={`${styles.pageTitle} m-0 d-flex align-items-center gap-2`}>
                    <span className="material-symbols-outlined">person</span>
                    Adicionar usuário
                </h2>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className={`${styles.btnSecondary} btn d-flex align-items-center gap-2`}
                        onClick={() => navigate("/dashboard/usuarios")}
                    >
                        <span className="material-symbols-outlined fs-5">arrow_back</span>
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="form-adicionar-usuario"
                        className={`${styles.btnPrimary} btn d-flex align-items-center gap-2`}
                    >
                        <span className="material-symbols-outlined fs-5">save</span>
                        Salvar
                    </button>
                </div>
            </div>

            <form id="form-adicionar-usuario" onSubmit={handleSubmit}>
                <div className="row g-4">
                    <div className="col-12 d-flex flex-column gap-4">
                        {/* Informações Usuário */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">person</span>
                                Informações Usuário
                            </div>

                            <div className="card-body row g-3">
                                <div className="col-12 d-flex align-items-center gap-3 mb-2">
                                    <div className={`${styles.avatar} d-flex align-items-center justify-content-center fw-bold`}>
                                        {iniciais(form.nome)}
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className={styles.labelCustomAvatar}>{form.nome.split(" ")[0]}</span>
                                        <span className={styles.labelSubtext}>
                                            Criado em {new Date().toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="nome">
                                        <span className="material-symbols-outlined fs-6 me-1">badge</span>
                                        Nome Completo
                                    </label>
                                    <input
                                        id="nome"
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="nome"
                                        value={form.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="username">
                                        <span className="material-symbols-outlined fs-6 me-1">alternate_email</span>
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contato */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">call</span>
                                Contato
                            </div>

                            <div className="card-body row g-3">
                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="email">
                                        <span className="material-symbols-outlined fs-6 me-1">mail</span>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={`${styles.inputCustom} form-control`}
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="telefone">
                                        <span className="material-symbols-outlined fs-6 me-1">call</span>
                                        Telefone
                                    </label>
                                    <input
                                        id="telefone"
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="telefone"
                                        value={formatarTelefone(form.telefone)}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Documentação */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">badge</span>
                                Documentação
                            </div>

                            <div className="card-body row g-3">
                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="cpf">
                                        <span className="material-symbols-outlined fs-6 me-1">badge</span>
                                        CPF
                                    </label>
                                    <input
                                        id="cpf"
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="cpf"
                                        value={formatarCpf(form.cpf)}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Acesso */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">lock</span>
                                Acesso
                            </div>

                            <div className="card-body row g-3">
                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="senha">
                                        <span className="material-symbols-outlined fs-6 me-1">lock</span>
                                        Senha
                                    </label>
                                    <input
                                        id="senha"
                                        type="password"
                                        className={`${styles.inputCustom} form-control`}
                                        name="senha"
                                        value={form.senha}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="role">
                                        <span className="material-symbols-outlined fs-6 me-1">shield_person</span>
                                        Perfil de acesso
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        className={`${styles.selectCustom} form-select`}
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="user">Usuário Comum (user)</option>
                                        <option value="admin">Administrador (admin)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdicionarUsuario;