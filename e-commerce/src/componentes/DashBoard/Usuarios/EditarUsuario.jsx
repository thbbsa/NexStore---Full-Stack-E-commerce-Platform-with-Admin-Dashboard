import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { storeUser, getUserById, getEnderecosByUserId, storeEndereco, UpdateEndereco, excluirUsuario, deletarEndereco } from "../../../services/userService"
import styles from "./css/EditarUsuario.module.css";
import { formatarTelefone } from "../../../utils/formatters.js"

import ModalEndereco from "../../ModalEndereco/ModalEndereco ";
import ModalConfirmacaoExclusao from "../../ModalConfirmacaoExclusao/ModalConfirmacaoExclusao";


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

const EditarUsuario = () => {
    const navigate = useNavigate();

    // TODO: substituir pelos dados reais vindos da API (GET /usuarios/:id)
    const [form, setForm] = useState({
        Id: "",
        Nome: "",
        Username: "",
        Email: "",
        Telefone: "",
        cpf: "",
        role: "",
        ativo: false,
        criado: "",
    });
    const [formOriginal, setFormOriginal] = useState(null);
    const [enderecos, setEnderecos] = useState([]);

    const [messageSuccess, setMessageSuccess] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const [messageError, setMessageError] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [modalEndereco, setModalEndereco] = useState({ aberto: false, endereco: null });
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
    const [modalExclusaoEndereco, setModalExclusaoEndereco] = useState({ aberto: false, endereco: null });


    const { id } = useParams();


    const carregarEnderecos = async () => {
        try {
            const res = await getEnderecosByUserId(id);
            setEnderecos(res.enderecos);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function carregarDados() {
            try {
                const user = await getUserById(id);

                const dadosCarregados = {
                    Id: user.user.Id,
                    Nome: user.user.Nome,
                    Username: user.user.Username,
                    Email: user.user.Email,
                    Telefone: user.user.Telefone,
                    cpf: user.user.CPF,
                    role: user.user.Role,
                    ativo: user.user.Ativo,
                    criado: user.user.CriadoEm,
                };

                setForm(dadosCarregados);
                setFormOriginal(dadosCarregados);
                await carregarEnderecos();
            } catch (error) {
                console.error(error);
            }
        }

        carregarDados();
    }, [id]);


    const getChanges = (original, atual) => {
        const changes = {};
        for (const key in atual) {
            if (atual[key] !== original[key]) {
                changes[key] = atual[key];
            }
        }
        return changes;
    };


    const iniciais = (nome = "") =>
        nome
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((parte) => parte[0]?.toUpperCase())
            .join("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleAtivo = () => {
        setForm((prev) => ({ ...prev, ativo: !prev.ativo }));
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        const changes = getChanges(formOriginal, form);

        if (Object.keys(changes).length === 0) {
            navigate("/dashboard/usuarios");
            return;
        }

        try {
            const res = await storeUser({ Id: form.Id, ...changes });
            const data = await res.json();

            if (!res.ok) {
                mostrarMensagemErro(data.message);
                return;
            }

            mostrarMensagemSucesso(`Dados de ${form.Nome} atualizados com sucesso!`);
            setTimeout(() => navigate("/dashboard/usuarios"), 3000)
        } catch (error) {
            console.error(error);
            mostrarMensagemErro();
        }
    };

    const handleSalvarEndereco = async (dadosEndereco) => {
        const isNovo = !modalEndereco.endereco;

        try {
            let res;

            if (isNovo) {
                const enderecoPayload = {
                    logradouro: dadosEndereco.Rua,
                    bairro: dadosEndereco.Bairro,
                    localidade: dadosEndereco.Cidade,
                    estado: dadosEndereco.Estado,
                    cep: dadosEndereco.Cep,
                };

                res = await storeEndereco(enderecoPayload, dadosEndereco.Numero, dadosEndereco.Complemento, id);
            } else {
                // Editando um endereço existente — só manda o que mudou
                const mudancas = getChanges(modalEndereco.endereco, dadosEndereco);
                res = await UpdateEndereco({ Id_endereco: modalEndereco.endereco.Id_endereco, ...mudancas });
            }

            const data = await res.json();

            if (!res.ok) {
                mostrarMensagemErro(data.message);
                return;
            }

            mostrarMensagemSucesso(
                isNovo
                    ? `Endereço adicionado com sucesso!`
                    : `Endereço de ${form.Nome} atualizado com sucesso!`
            );

            await carregarEnderecos();
            setTimeout(() => setModalEndereco({ aberto: false, endereco: null }), 3000);
        } catch (error) {
            console.error(error);
            mostrarMensagemErro();
        }
    };

    const handleExcluirUsuario = async () => {
        try {
            const res = await excluirUsuario(form.Id);
            const data = await res.json();

            if (!res.ok) {
                mostrarMensagemErro(data.message);
                return;
            }

            setModalExclusaoAberto(false);
            mostrarMensagemSucesso(`Usuário excluído com sucesso!`);
            setTimeout(() => navigate("/dashboard/usuarios"), 2000);
        } catch (error) {
            console.error(error);
            mostrarMensagemErro();
        }
    };

    const handleExcluirEndereco = async () => {
        try {
            const res = await deletarEndereco(modalExclusaoEndereco.endereco.Id_endereco);
            const data = await res.json();

            if (!res.ok) {
                // Ex: "Este endereço não pode ser excluído porque está vinculado a um ou mais pedidos."
                mostrarMensagemErro(data.message);
                return;
            }

            mostrarMensagemSucesso("Endereço excluído com sucesso!");
            await carregarEnderecos();
            setModalExclusaoEndereco({ aberto: false, endereco: null });
        } catch (error) {
            console.error(error);
            mostrarMensagemErro();
        }
    };

    return (
        <div className={`${styles.containerUsuario} container-fluid p-4`}>
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


            {/* Topo da página */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h2 className={`${styles.pageTitle} m-0 d-flex align-items-center gap-2`}>
                    <span className="material-symbols-outlined">manage_accounts</span>
                    Editar usuário
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
                        form="form-editar-usuario"
                        className={`${styles.btnPrimary} btn d-flex align-items-center gap-2`}
                    >
                        <span className="material-symbols-outlined fs-5">save</span>
                        Salvar alterações
                    </button>
                </div>
            </div>

            <form id="form-editar-usuario" onSubmit={handleSubmit}>
                <div className="row g-4">
                    {/* Coluna Principal */}
                    <div className="col-lg-8 col-12 d-flex flex-column gap-4">

                        {/* Informações Básicas */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">person</span>
                                Informações básicas
                            </div>
                            <div className="card-body row g-3">

                                {/* Header do Avatar do Usuário */}
                                <div className="col-12 d-flex align-items-center gap-3 mb-2">
                                    <div className={`${styles.avatar} d-flex align-items-center justify-content-center fw-bold`}>
                                        {iniciais(form.Nome)}
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className={styles.labelCustomAvatar}>{form.Nome}</span>
                                        <span className={styles.labelSubtext}>
                                            ID #{form.Id} · criado em {new Date(form.criado).toLocaleDateString("pt-BR")}
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
                                        name="Nome"
                                        value={form.Nome}
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
                                        name="Username"
                                        value={form.Username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="email">
                                        <span className="material-symbols-outlined fs-6 me-1">mail</span>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={`${styles.inputCustom} form-control`}
                                        name="Email"
                                        value={form.Email}
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
                                        name="Telefone"
                                        value={formatarTelefone(form.Telefone)}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`} htmlFor="cpf">
                                        <span className="material-symbols-outlined fs-6 me-1">lock</span>
                                        CPF
                                    </label>
                                    <input
                                        id="cpf"
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="cpf"
                                        value={form.cpf.replace(
                                            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                                            "$1.$2.$3-$4"
                                        )}
                                        disabled
                                        readOnly
                                    />
                                    <small className={styles.labelCustomCPF}>
                                        O CPF não pode ser alterado depois do cadastro.
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Segurança */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">security</span>
                                Segurança
                            </div>
                            <div className="card-body">
                                <button
                                    type="button"
                                    className={`${styles.botaoRecuperar} d-flex align-items-center gap-2`}
                                    onClick={() => {
                                        // TODO: chamar API de envio de link de redefinição
                                    }}
                                >
                                    <span className="material-symbols-outlined fs-5">lock_reset</span>
                                    Enviar link de redefinição de senha
                                </button>
                            </div>
                        </div>

                        {/* Endereços Cadastrados */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex justify-content-between align-items-center`}>
                                <span className="d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined fs-5">location_on</span>
                                    Endereços cadastrados
                                </span>
                                <button
                                    type="button"
                                    className={`${styles.btnAction} d-flex align-items-center gap-1`}
                                    title="Adicionar endereço"
                                    onClick={() => setModalEndereco({ aberto: true, endereco: null })}
                                >
                                    <span className="material-symbols-outlined fs-6">add</span>
                                    Adicionar
                                </button>
                            </div>

                            {enderecos.map((endereco) => (
                                <div
                                    key={endereco.Id_endereco}
                                    className={`${styles.enderecoRow} d-flex align-items-center justify-content-between gap-3 p-3`}
                                >
                                    <div className="d-flex flex-column">
                                        <span className={styles.labelCustomEndereco}>
                                            {endereco.Rua}, {endereco.Numero} - {endereco.Bairro}
                                        </span>

                                        <span className={styles.textMuted}>
                                            {endereco.Cidade} - {endereco.Estado}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        {endereco.Principal && (
                                            <span className={styles.badgePrincipal}>Principal</span>
                                        )}

                                        <div className={styles.acoes}>
                                            <button
                                                type="button"
                                                className={`${styles.btnAction} btn p-1 me-1`}
                                                title="Editar"
                                                onClick={() => setModalEndereco({ aberto: true, endereco: endereco })}
                                            >
                                                <span className="material-symbols-outlined fs-5">edit</span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`${styles.btnAction} btn text-danger p-1`}
                                                title="Excluir"
                                                onClick={() => setModalExclusaoEndereco({ aberto: true, endereco: endereco })}
                                            >
                                                <span className="material-symbols-outlined fs-5">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Coluna Lateral */}
                    <div className="col-lg-4 col-12 d-flex flex-column gap-4">

                        {/* Permissão */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">admin_panel_settings</span>
                                Permissão
                            </div>
                            <div className="card-body">
                                <label className={`${styles.labelCustom} form-label`} htmlFor="role">
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

                        {/* Status da Conta */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2`}>
                                <span className="material-symbols-outlined fs-5">toggle_on</span>
                                Status da conta
                            </div>
                            <div className={`${styles.statusBody} card-body d-flex align-items-center gap-3`}>
                                <label className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        checked={form.ativo}
                                        onChange={handleToggleAtivo}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                                <span className={styles.labelCustom} style={{ margin: 0 }}>
                                    {form.ativo ? "Conta Ativa" : "Conta Inativa"}
                                </span>
                            </div>
                        </div>

                        {/* Ações Sensíveis */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header d-flex align-items-center gap-2 text-danger`}>
                                <span className="material-symbols-outlined fs-5">warning</span>
                                Zona de Risco
                            </div>
                            <div className="card-body">
                                <button
                                    type="button"
                                    className={`${styles.btnDanger} btn w-100 d-flex align-items-center justify-content-center gap-2`}
                                    onClick={() => setModalExclusaoAberto(true)}
                                >
                                    <span className="material-symbols-outlined fs-5">person_remove</span>
                                    Excluir usuário
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </form>

            {modalEndereco.aberto && (
                <ModalEndereco
                    endereco={modalEndereco.endereco}
                    onClose={() => setModalEndereco({ aberto: false, endereco: null })}
                    onSalvar={handleSalvarEndereco}
                />
            )}

            {modalExclusaoAberto && (
                <ModalConfirmacaoExclusao
                    nomeAlvo={form.Nome}
                    onClose={() => setModalExclusaoAberto(false)}
                    onConfirmar={handleExcluirUsuario}
                />
            )}

            {modalExclusaoEndereco.aberto && (
                <ModalConfirmacaoExclusao
                    titulo="Excluir endereço"
                    mensagem={
                        <>Tem certeza que deseja excluir o endereço <strong>{modalExclusaoEndereco.endereco?.Rua}, {modalExclusaoEndereco.endereco?.Numero}</strong>?</>
                    }
                    onClose={() => setModalExclusaoEndereco({ aberto: false, endereco: null })}
                    onConfirmar={handleExcluirEndereco}
                />
            )}
        </div>
    );
};

export default EditarUsuario;