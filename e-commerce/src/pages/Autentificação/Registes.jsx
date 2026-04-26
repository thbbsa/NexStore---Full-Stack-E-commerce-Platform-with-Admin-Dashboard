import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { storeUser } from "../../services/userService.js";
import "../../css/register.css";

export default function Register() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [cpfFormatado, setCpfFormatado] = useState("");
    const [telefoneFormatado, setTelefoneFormatado] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const clearError = () => setError("");

    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        return score;
    };

    const checkName = (name) => {
        if (!name || name.length < 3) {
            setError("Nome inválido. Deve conter no mínimo 3 caracteres.");
            return false;
        }
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
            setError("Nome deve conter apenas letras e espaços.");
            return false;
        }
        clearError();
        return true;
    };

    const checkUsername = (username) => {
        if (!username || username.length < 3) {
            setError("Username inválido. Mínimo 3 caracteres.");
            return false;
        }
        if (!/^\w+$/.test(username)) {
            setError("Username deve conter apenas letras, números e underscores.");
            return false;
        }
        clearError();
        return true;
    };

    const checkEmail = (email) => {
        if (!email) { setError("O campo de e-mail não pode estar vazio."); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Digite um e-mail válido (ex: exemplo@dominio.com).");
            return false;
        }
        clearError();
        return true;
    };

    const formatarCpf = (value) => {
        value = value.replace(/\D/g, '')
        value = value.slice(0, 11)

        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

        return value
    }


    const checkCPF = (cpf) => {
        const cpfLimpo = cpf.replace(/\D/g, '')

        if (!cpf) { setError("O campo de CPF não pode estar vazio."); return false; }
        if (cpfLimpo.length < 11) { setError("Cpf inválido. Coloque um cpf válido"); return false; }

        clearError();
        return true;
    }

    const formatarTelefone = (value) => {
        value = value.replace(/\D/g, '')
        value = value.slice(0, 11)

        if (value.length <= 10) {
            // telefone fixo
            value = value.replace(/(\d{2})(\d)/, '($1) $2')
            value = value.replace(/(\d{4})(\d)/, '$1-$2')
        } else {
            // celular
            value = value.replace(/(\d{2})(\d)/, '($1) $2')
            value = value.replace(/(\d{5})(\d)/, '$1-$2')
        }

        return value
    }

    const checkTelefone = (telefone) => {
        if (!telefone) { setError("O campo de Telefone não pode estar vazio."); return false; }
        if (telefone.length < 11) { setError("Telefone inválido."); return false; }

        clearError();
        return true;
    }

    const checkPassword = (password) => {
        if (!password) { setError("O campo de senha não pode estar vazio."); return false; }
        if (password.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return false; }
        if (!/[A-Z]/.test(password)) { setError("A senha deve conter pelo menos uma letra maiúscula."); return false; }
        if (!/[0-9]/.test(password)) { setError("A senha deve conter pelo menos um número."); return false; }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError("A senha deve conter pelo menos um caractere especial (ex: @, #, !).");
            return false;
        }
        clearError();
        return true;
    };

    const checkPasswordMatch = (password, confirmPassword) => {
        if (password !== confirmPassword) { setError("As senhas não coincidem."); return false; }
        clearError();
        return true;
    };

    const validateForm = (value) => {
        if (!checkName(value.nome)) return false;
        if (!checkUsername(value.username)) return false;
        if (!checkCPF(value.cpf)) return false;
        if (!checkEmail(value.email)) return false;
        if (!checkTelefone(value.telefone)) return false;
        if (!checkPassword(value.senha)) return false;
        if (!checkPasswordMatch(value.senha, value.confirmPassword)) return false;
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());

        // LIMPAR MÁSCARAS
        value.cpf = value.cpf.replace(/\D/g, '')
        value.telefone = value.telefone.replace(/\D/g, '')

        if (!validateForm(value)) return;

        setIsLoading(true);
        setIsDisabled(true);
        setError("");

        try {
            const response = await storeUser(value);
            const result = await response.json();

            if (response.ok) {
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError(result.message || "Erro ao registrar usuário.");
                setIsLoading(false);
                setIsDisabled(false);
            }
        } catch (err) {
            console.error("Erro de rede:", err);
            setError("Erro de conexão com o servidor.");
            setIsLoading(false);
            setIsDisabled(false);
        }
    };

    const strengthLabel = ["", "Fraca", "Média", "Boa", "Forte"];
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
