import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";

import { formatarCpf, formatarTelefone } from "../../utils/formatters.js";

import useRegister from "./hook/useRegisterValidation.js";

export default function Register() {
    const navigate = useNavigate();

    const [cpfFormatado, setCpfFormatado] = useState("");
    const [telefoneFormatado, setTelefoneFormatado] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        error,
        setError,
        isLoading,
        isDisabled,
        handleSubmit
    } = useRegister();

    const strengthClass = ["", "active-weak", "active-medium", "active-strong", "active-strong"];

    return (
        <div className="register-page">
            <div className="register-card">

                {/* Header */}
                <div className="register-header">
                    <div className="register-logo-ring">
                        <span className="msymbol">person_add</span>
                    </div>
                    <h1 className="register-title">Criar conta</h1>
                    <p className="register-subtitle">Preencha os dados para se registrar</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Nome + Username em grid */}
                    <div className="register-grid">
                        <div className="register-field">
                            <label htmlFor="nome">Nome Completo</label>
                            <div className="register-input-wrap">
                                <span className="register-icon">badge</span>
                                <input
                                    className="register-input"
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="username">Username</label>
                            <div className="register-input-wrap">
                                <span className="register-icon">alternate_email</span>
                                <input
                                    className="register-input"
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="@username"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Email */}
                    <div className="register-field" style={{ marginTop: 14 }}>
                        <label htmlFor="email">CPF</label>
                        <div className="register-input-wrap">
                            <span className="register-icon">mail</span>
                            <input
                                className="register-input"
                                id="cpf"
                                name="cpf"
                                type="cpf"
                                placeholder="125.265.388-57"
                                value={cpfFormatado}
                                onChange={(e) => setCpfFormatado(formatarCpf(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="register-field" style={{ marginTop: 14 }}>
                        <label htmlFor="email">Email</label>
                        <div className="register-input-wrap">
                            <span className="register-icon">mail</span>
                            <input
                                className="register-input"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="register-field" style={{ marginTop: 14 }}>
                        <label htmlFor="email">Telefone</label>
                        <div className="register-input-wrap">
                            <span className="register-icon">mail</span>
                            <input
                                className="register-input"
                                id="telefone"
                                name="telefone"
                                type="telefone"
                                placeholder="(11) 9999-9999"
                                value={telefoneFormatado}
                                onChange={(e) => setTelefoneFormatado(formatarTelefone(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="register-divider" />

                    {/* Senha */}
                    <div className="register-field">
                        <label htmlFor="senha">Senha</label>
                        <div className="register-input-wrap">
                            <span className="register-icon">lock</span>
                            <input
                                className="register-input"
                                id="senha"
                                name="senha"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                onChange={(e) => setPasswordStrength(getPasswordStrength(e.target.value))}
                            />
                            <button
                                type="button"
                                className="register-toggle-btn"
                                onClick={() => setShowPassword(v => !v)}
                                tabIndex={-1}
                            >
                                <span className="msymbol">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                        {/* Força da senha */}
                        <div className="register-strength">
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className={`register-strength-bar${passwordStrength >= i ? ` ${strengthClass[passwordStrength]}` : ""}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Confirmar senha */}
                    <div className="register-field">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <div className="register-input-wrap">
                            <span className="register-icon">lock_reset</span>
                            <input
                                className="register-input"
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="register-toggle-btn"
                                onClick={() => setShowConfirm(v => !v)}
                                tabIndex={-1}
                            >
                                <span className="msymbol">
                                    {showConfirm ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="register-error">
                            <span className="msymbol">error</span>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button className="register-btn" type="submit" disabled={isDisabled}>
                        <span className="msymbol">
                            {isLoading ? "autorenew" : "how_to_reg"}
                        </span>
                        {isLoading ? "Registrando..." : "Criar Conta"}
                    </button>

                    {/* Login link */}
                    <p className="register-footer">
                        Já tem uma conta?{" "}
                        <Link to="/login">Fazer login</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}
