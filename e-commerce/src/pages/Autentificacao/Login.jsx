import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import useLogin from "./hook/useLoginValidation.js";

export default function Login() {
    const {
        error,
        isDisabled,
        isLoading,
        handleSubmit
    } = useLogin();

    return (
        <div className="login-page">
            <div className="login-card">

                {/* Header */}
                <div className="login-header">
                    <div className="login-logo-ring">
                        <span className="msymbol">storefront</span>
                    </div>
                    <h1 className="login-title">Bem-vindo de volta</h1>
                    <p className="login-subtitle">Entre na sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="login-field">
                        <label htmlFor="email">Email</label>
                        <div className="login-input-wrap">
                            <span className="login-icon">mail</span>
                            <input
                                className="login-input"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div className="login-field">
                        <label htmlFor="senha">Senha</label>
                        <div className="login-input-wrap">
                            <span className="login-icon">lock</span>
                            <input
                                className="login-input"
                                id="senha"
                                name="senha"
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="login-row">
                        <label className="login-remember">
                            <input type="checkbox" name="checkbox" />
                            <span>Lembrar de mim</span>
                        </label>
                        <a href="#" className="login-forgot">Esqueceu a senha?</a>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="login-error">
                            <span className="msymbol">error</span>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button className="login-btn" type="submit" disabled={isDisabled}>
                        <span className="msymbol">
                            {isLoading ? "autorenew" : "login"}
                        </span>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>

                    {/* Register link */}
                    <p className="login-footer">
                        Não tem uma conta?{" "}
                        <Link to="/register">Criar conta</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}