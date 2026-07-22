import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/EditarUsuario.module.css";

const EditarUsuario = () => {
  const navigate = useNavigate();

  // TODO: substituir pelos dados reais vindos da API (GET /usuarios/:id)
  const [form, setForm] = useState({
    nome: "Thiago Barbosa de Oliveira",
    username: "thbbsa",
    email: "thiago.b2007@gmail.com",
    telefone: "(11) 98888-1234",
    cpf: "123.456.789-00",
    role: "user",
    ativo: true,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: chamar API (PUT /usuarios/:id) com { ...form }
    console.log("Salvando usuário:", form);
  };

  return (
    <div className={`${styles.containerUsuario} container-fluid p-4`}>
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
                    {iniciais(form.nome)}
                  </div>
                  <div className="d-flex flex-column">
                    <span className={styles.labelCustomAvatar}>{form.nome}</span>
                    <span className={styles.labelSubtext}>
                      ID #1 · criado em 12/03/2026
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
                    value={form.telefone}
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
                    value={form.cpf}
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
                >
                  <span className="material-symbols-outlined fs-6">add</span>
                  Adicionar
                </button>
              </div>
              
              <div className={`${styles.enderecoRow} d-flex align-items-center justify-content-between gap-3 p-3`}>
                <div className="d-flex flex-column">
                  <span className={styles.labelCustomEndereco}>
                    Rua das Flores, 123 - Centro
                  </span>
                  <span className={styles.textMuted}>Embu das Artes - SP</span>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                  <span className={styles.badgePrincipal}>Principal</span>
                  <div className={styles.acoes}>
                    <button type="button" className={`${styles.btnAction} btn p-1 me-1`} title="Editar">
                      <span className="material-symbols-outlined fs-5">edit</span>
                    </button>
                    <button type="button" className={`${styles.btnAction} btn text-danger p-1`} title="Excluir">
                      <span className="material-symbols-outlined fs-5">delete</span>
                    </button>
                  </div>
                </div>
              </div>
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
                  onClick={() => {
                    // TODO: abrir modal de confirmação antes de excluir
                  }}
                >
                  <span className="material-symbols-outlined fs-5">person_remove</span>
                  Excluir usuário
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuario;