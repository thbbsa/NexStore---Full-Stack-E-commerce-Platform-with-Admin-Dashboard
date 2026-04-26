import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { useHeader } from "./hooks/useHeader";
import { useEndereco } from "./hooks/useEndereco";
import HeaderSearch from "./components/HeaderSearch";
import HeaderProfile from "./components/HeaderProfile";
import EnderecoModal from "./components/EnderecoModal";
import "./header.css";

const Header = () => {
    const {
        busca, setBusca,
        scrolled,
        dropdownOpen, setDropdownOpen,
        openModal, setOpenModal,
        username, isLogged, initials,
        dropdownRef,
        handleBuscar,
        handleLogout,
    } = useHeader();

    const {
        enderecos,
        enderecoSelecionado, setEnderecoSelecionado,
        enderecoSalvo,
        confirmarEndereco,
    } = useEndereco();

    return (
        <>
            <header className={`hdr-root${scrolled ? " scrolled" : ""}`}>
                <div className="hdr-inner">

                    {/* Logo + saudação */}
                    <Link to="/" className="hdr-logo-wrap">
                        <img src={logo} alt="Logo" />
                        <span className="hdr-greeting">
                            Olá, <span>{isLogged ? username : "Visitante"}!</span>
                        </span>
                    </Link>

                    {/* Busca */}
                    <HeaderSearch busca={busca} setBusca={setBusca} onSubmit={handleBuscar} />

                    {/* Ações */}
                    <div className="hdr-actions">
                        {isLogged ? (
                            <>
                                {/* Localização */}
                                <div className="hdr-location" onClick={() => setOpenModal(true)}>
                                    <span className="label">Enviar para</span>
                                    <span className="value">
                                        <span className="msymbol">location_on</span>
                                        {enderecoSalvo || "Digite o CEP"}
                                    </span>
                                </div>

                                <div className="hdr-divider" />

                                {/* Favoritos */}
                                <button className="hdr-icon-btn" title="Favoritos">
                                    <span className="msymbol">favorite</span>
                                </button>

                                {/* Carrinho */}
                                <Link to="/carrinho" className="hdr-icon-btn" title="Carrinho">
                                    <span className="msymbol">shopping_bag</span>
                                    <span className="hdr-badge" />
                                </Link>

                                <div className="hdr-divider" />

                                {/* Perfil */}
                                <HeaderProfile
                                    username={username}
                                    initials={initials}
                                    dropdownOpen={dropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                    dropdownRef={dropdownRef}
                                    onLogout={handleLogout}
                                />
                            </>
                        ) : (
                            <div className="hdr-guest">
                                <Link to="/login" className="hdr-btn-login">
                                    <span className="msymbol">login</span>
                                    Entrar
                                </Link>
                                <Link to="/register" className="hdr-btn-register">
                                    Criar conta
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal de endereço */}
            {openModal && (
                <EnderecoModal
                    enderecos={enderecos}
                    enderecoSelecionado={enderecoSelecionado}
                    setEnderecoSelecionado={setEnderecoSelecionado}
                    onConfirmar={confirmarEndereco}
                    onFechar={() => setOpenModal(false)}
                />
            )}
        </>
    );
};

export default Header;