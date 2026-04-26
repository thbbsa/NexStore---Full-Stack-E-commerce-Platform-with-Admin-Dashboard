import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { logout, getMe, storeEndereco, getEndereco, UpdateEndereco } from "../../services/userService";
import "./header.css";

const Header = () => {
    const [busca, setBusca] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [username, setUsername] = useState("");
    const [cep, setCep] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [enderecoSalvo, setEnderecoSalvo] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const [enderecos, setEnderecos] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUsername(res?.user?.Username || "");
            } catch {
                setUsername("");
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        // Criamos um controlador para cancelar a busca caso o usuário mude de página rápido
        const controller = new AbortController();
        const signal = controller.signal;
        async function buscarEnderecoSalvo() {
            try {
                const response = await getEndereco({ signal });

                if (!response.ok) return;

                const dados = await response.json();

                if (dados) {
                    setEnderecos(Array.isArray(dados) ? dados : [dados]);

                    // Definir Como Endereço Salvo o endereço principal, se existir
                    const enderecoPrincipal = dados.find(e => e.Principal === true);
                    await PrencherLabel(enderecoPrincipal.Cep, enderecoPrincipal.Numero, enderecoPrincipal.Complemento); // Atualiza o label com os dados salvos

                    if (dados.length > 0) setEnderecoSelecionado(enderecoPrincipal.Id_endereco);
                }


            } catch (error) {
                if (error.name === 'AbortError') {
                    // Requisição cancelada propositalmente, ignoramos o log
                } else {
                    console.error("Erro ao buscar endereço:", error);
                }
            }
        }
        buscarEnderecoSalvo();
    }, []);

    const isLogged = username !== "";

    function handleBuscar(e) {
        e.preventDefault();
        if (!busca.trim()) return;
        navigate(`/produtos?q=${busca}`);
    }

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    }

    async function PrencherLabel(cep, numero, complemento) {
        if (!cep.trim()) return;
        const label = complemento.trim()
            ? `${cep}, nº ${numero} — ${complemento}`
            : numero.trim()
                ? `${cep}, nº ${numero}`
                : cep;
        setEnderecoSalvo(label);
        setOpenModal(false);
    }

    async function handleConfirmarEndereco() {
        if (cep === "") {
            const endereco = enderecos.find(e => e.Id_endereco === enderecoSelecionado);

            await UpdateEndereco(endereco);
            setOpenModal(false);
            await PrencherLabel(endereco.Cep, endereco.Numero, endereco.Complemento);
        } else {
            try {
                const url = `https://viacep.com.br/ws/${cep}/json/`
                const data = await fetch(url)
                const response = await data.json()

                await storeEndereco(response, numero, complemento);
                setOpenModal(false);
            } catch (error) {
                console.error("Erro ao salvar endereço:", error);
            }
        }
    }

    const initials = username ? username.slice(0, 2).toUpperCase() : "??";

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
                    <div className="hdr-search">
                        <form onSubmit={handleBuscar}>
                            <span className="msymbol" style={{ fontSize: 18, color: "var(--text-muted)" }}>search</span>
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar produtos..."
                            />
                            <button
                                type="submit"
                                disabled={!busca.trim()}
                                className="hdr-search-btn"
                            >
                                <span className="msymbol" style={{ fontSize: 18 }}>arrow_forward</span>
                            </button>
                        </form>
                    </div>

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

                                {/* Perfil dropdown */}
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
                                            onClick={() => { setDropdownOpen(false); handleLogout(); }}
                                        >
                                            <span className="msymbol">logout</span>
                                            Sair
                                        </button>
                                    </div>
                                </div>
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

            {/* Modal CEP */}
            {openModal && (
                <div className="cep-overlay" onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}>
                    <div className="cep-modal">
                        <div className="cep-modal-header">
                            <div className="cep-modal-icon">
                                <span className="msymbol">location_on</span>
                            </div>
                            <div>
                                <h3 className="cep-modal-title">Endereço de entrega</h3>
                                <p className="cep-modal-sub">Informe onde quer receber seus pedidos</p>
                            </div>
                            <button className="cep-modal-close" onClick={() => setOpenModal(false)}>
                                <span className="msymbol">close</span>
                            </button>
                        </div>

                        <div className="cep-modal-body">

                            <div className="ck-addr-list">
                                {enderecos.map(e => (
                                    <div
                                        key={e.Id_endereco}
                                        className={`ck-addr-card${enderecoSelecionado === e.Id_endereco ? " selected" : ""}`}
                                        onClick={() => setEnderecoSelecionado(e.Id_endereco)}
                                    >
                                        <div className="ck-addr-radio">
                                            <div className="ck-addr-radio-dot" />
                                        </div>

                                        <div className="ck-addr-info">
                                            <div className="ck-addr-label-row">
                                                <span className="ck-addr-tag">{e.Label}</span>
                                            </div>

                                            <div className="ck-addr-main">
                                                {e.Rua}, {e.Numero}
                                                {e.Complemento ? ` — ${e.Complemento}` : ""}
                                            </div>

                                            <div className="ck-addr-sub">
                                                {e.Bairro} · {e.Cidade}/{e.Estado} · {e.Cep}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cep-field">
                                <label>CEP</label>
                                <div className="cep-input-wrap">
                                    <span className="msymbol cep-input-icon">pin_drop</span>
                                    <input
                                        type="text"
                                        className="cep-input"
                                        placeholder="00000-000"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        maxLength={9}
                                    />
                                </div>
                                <a
                                    href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="cep-nao-sei"
                                >
                                    Não sei meu CEP
                                </a>
                            </div>

                            <div className="cep-row">
                                <div className="cep-field">
                                    <label>Número</label>
                                    <div className="cep-input-wrap">
                                        <span className="msymbol cep-input-icon">tag</span>
                                        <input
                                            type="text"
                                            className="cep-input"
                                            placeholder="123"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="cep-field" style={{ flex: 2 }}>
                                    <label>Complemento <span className="cep-optional">opcional</span></label>
                                    <div className="cep-input-wrap">
                                        <span className="msymbol cep-input-icon">apartment</span>
                                        <input
                                            type="text"
                                            className="cep-input"
                                            placeholder="Apto, bloco, casa..."
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="cep-modal-footer">
                            <button className="cep-btn-cancel" onClick={() => setOpenModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className="cep-btn-confirm"
                                disabled={!cep.trim() && enderecoSelecionado === null}
                                onClick={handleConfirmarEndereco}
                            >
                                <span className="msymbol">check</span>
                                Confirmar endereço
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default Header;