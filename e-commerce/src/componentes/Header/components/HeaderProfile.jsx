import React from "react";
import { Link } from "react-router-dom";

const HeaderProfile = ({ username, initials, dropdownOpen, setDropdownOpen, dropdownRef, onLogout }) => (
    <div className="hdr-profile" ref={dropdownRef}>
        <button
            className={`hdr-profile-btn${dropdownOpen ? " open" : ""}`}
            onClick={() => setDropdownOpen((v) => !v)}
        >
            <div className="hdr-avatar">{initials}</div>
            {username}
            <span className={`msymbol hdr-chevron${dropdownOpen ? " open" : ""}`}>expand_more</span>
        </button>

        <div className={`hdr-dropdown${dropdownOpen ? " open" : ""}`}>
            <div className="hdr-dropdown-header">
                <div className="hdr-dropdown-name">{username}</div>
                <div className="hdr-dropdown-email">Minha conta</div>
            </div>
            <Link to="/perfil" onClick={() => setDropdownOpen(false)}>
                <span className="msymbol">person</span>
                Meu Perfil
            </Link>
            <Link to="#" onClick={() => setDropdownOpen(false)}>
                <span className="msymbol">receipt_long</span>
                Meus Pedidos
            </Link>
            <Link to="#" onClick={() => setDropdownOpen(false)}>
                <span className="msymbol">settings</span>
                Configurações
            </Link>
            <div className="divider" />
            <button
                className="danger"
                onClick={() => { setDropdownOpen(false); onLogout(); }}
            >
                <span className="msymbol">logout</span>
                Sair
            </button>
        </div>
    </div>
);

export default HeaderProfile;