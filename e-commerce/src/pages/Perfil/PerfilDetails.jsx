import React, { useEffect, useState } from "react";
import Header from "../../componentes/Home/Header";
import { getMe, storeUser, getEndereco } from '../../services/userService';
import "../../css/PerfilDetails.css";

const PerfilDetails = () => {
    const [user, setUser] = useState({
        Id: '', Nome: '', Username: '', Email: '', Telefone: '', CPF: ''
    });

    const [enderecos, setEnderecos] = useState({
        Rua: '', Numero: '', Complemento: '', Bairro: '',
        Cidade: '', Estado: '', CEP: '', Principal: null
    });

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [originalUser, setOriginalUser] = useState({});
    const [originalEndereco, setOriginalEndereco] = useState({});

    useEffect(() => {
        const carregarInfoUser = async () => {
            try {
                const data = await getMe();
                const response = await getEndereco({ signal: new AbortController().signal });
                const enderecos = await response.json();

                setUser(data.user || data);
                setOriginalUser(data.user || data);
                setEnderecos(enderecos);
                setOriginalEndereco(enderecos);

            } catch (error) {
                console.error("Erro ao carregar info do usuário:", error);
            }
        };
        carregarInfoUser();
    }, []);


    const formatarCpf = (value) => {
        value = value.replace(/\D/g, '')
        value = value.slice(0, 11)

        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

        return value
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

    const verificarCamposMudados = (original, atual) => {
        const mudancas = {};

        for (const key in original) {
            if (key === "Id") {
                mudancas[key] = original[key]; // sempre envie o Id para identificação
                continue;
            }

            if (atual.hasOwnProperty(key) && original[key] !== atual[key]) {
                mudancas[key] = atual[key];
            }

        }

        return mudancas;
    }

    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

     const handleChangeEndereco = (e) => {
        const { name, value } = e.target;
        setEnderecos(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setUser(originalUser);
        setEnderecos(originalEndereco);
        setMessage("");
        setStatus("");
        setIsEditing(false);
    };

    const handleEditProfile = async () => {
        if (isEditing) {
            const isEqual = JSON.stringify(user) === JSON.stringify(originalUser);
            if (isEqual) {
                setMessage("Nenhuma alteração feita.");
                setStatus("error");
                setIsEditing(false);
                return;
            }
            try {
                const userToSend = {
                    ...user,
                    CPF: user.CPF.replace(/\D/g, ''),
                    Telefone: user.Telefone.replace(/\D/g, '')
                };

                const camposMudados = verificarCamposMudados(originalUser, userToSend);

                if (Object.keys(camposMudados).length === 0) {
                    setMessage("Nenhuma alteração feita.");
                    setStatus("error");
                    setIsEditing(false);
                    return;
                }

                const response = await storeUser(camposMudados);

                if (response.ok) {
                    const result = await response.json();
                    setMessage(result.message);
                    setStatus("success");
                    setOriginalUser(user);
                    setIsEditing(false);
                } else {
                    const errorData = await response.json();
                    setMessage(errorData.message);
                    setStatus("error");
                }
            } catch (error) {
                console.error("Erro de rede ao atualizar perfil:", error);
            }
        } else {
            setMessage("");
            setStatus("");
            setIsEditing(true);
        }
    };

    console.log("enderecos", enderecos);

    // Iniciais para o avatar
    const initials = user.Nome
        ? user.Nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
        : user.Username?.slice(0, 2).toUpperCase() || "??";

    return (
        <div className="perfil-page">
            <Header />

            <div className="perfil-container">

                {/* Hero */}
                <div className="perfil-hero">
                    <div className="perfil-avatar">{initials}</div>
                    <div className="perfil-hero-info">
                        <h2>{user.Nome || user.Username || "Meu Perfil"}</h2>
                        <p>{user.Email || "Carregando informações..."}</p>
                    </div>
                </div>

                <div className="perfil-card">

                    {/* Seção: Dados Pessoais */}
                    <div className="perfil-section">
                        <div className="perfil-section-title">Dados Pessoais</div>
                        <div className="perfil-grid">

                            <div className="perfil-field">
                                <label>Username</label>
                                <div className="perfil-input-wrap">
                                    <span className="perfil-input-icon">person</span>
                                    <input
                                        className="perfil-input with-icon"
                                        type="text"
                                        name="Username"
                                        value={user.Username ?? ''}
                                        onChange={handleChangeUser}
                                        disabled={!isEditing}
                                        placeholder="@username"
                                    />
                                </div>
                            </div>

                            <div className="perfil-field">
                                <label>Nome Completo</label>
                                <div className="perfil-input-wrap">
                                    <span className="perfil-input-icon">badge</span>
                                    <input
                                        className="perfil-input with-icon"
                                        type="text"
                                        name="Nome"
                                        value={user.Nome ?? ''}
                                        onChange={handleChangeUser}
                                        disabled={!isEditing}
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            <div className="perfil-field">
                                <label>Email</label>
                                <div className="perfil-input-wrap">
                                    <span className="perfil-input-icon">mail</span>
                                    <input
                                        className="perfil-input with-icon"
                                        type="email"
                                        name="Email"
                                        value={user.Email ?? ''}
                                        onChange={handleChangeUser}
                                        disabled={!isEditing}
                                        placeholder="email@exemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="perfil-field">
                                <label>Telefone</label>
                                <div className="perfil-input-wrap">
                                    <span className="perfil-input-icon">call</span>
                                    <input
                                        className="perfil-input with-icon"
                                        type="text"
                                        name="Telefone"
                                        value={formatarTelefone(user.Telefone) || ''}
                                        onChange={handleChangeUser}
                                        disabled={!isEditing}
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>

                            <div className="perfil-field span2">
                                <label>
                                    CPF
                                    <span className="perfil-field-locked">
                                        <span className="msymbol">lock</span>
                                        não editável
                                    </span>
                                </label>
                                <div className="perfil-input-wrap perfil-input-wrap--locked">
                                    <span className="perfil-input-icon">badge</span>
                                    <input
                                        className="perfil-input with-icon"
                                        type="text"
                                        name="CPF"
                                        value={formatarCpf(user.CPF || '')}
                                        disabled
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Seção: Endereço */}
                    <div className="perfil-section">
                        <div className="perfil-section-title">Endereço</div>
                        <div className="perfil-grid">

                            <div className="perfil-field span2">
                                <label>Rua</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="Rua"
                                    value={enderecos.Rua ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="Nome da rua"
                                />
                            </div>

                            <div className="perfil-field">
                                <label>Número</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="Numero"
                                    value={enderecos.Numero ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="123"
                                />
                            </div>

                            <div className="perfil-field">
                                <label>Complemento</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="Complemento"
                                    value={enderecos.Complemento ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="Apto, bloco..."
                                />
                            </div>

                            <div className="perfil-field span2">
                                <label>Bairro</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="Bairro"
                                    value={enderecos.Bairro ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="Seu bairro"
                                />
                            </div>

                            <div className="perfil-field">
                                <label>Cidade</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="Cidade"
                                    value={enderecos.Cidade ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="São Paulo"
                                />
                            </div>

                            <div className="perfil-field">
                                <label>Estado</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="Estado"
                                    value={enderecos.Estado ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="SP"
                                />
                            </div>

                            <div className="perfil-field">
                                <label>CEP</label>
                                <input
                                    className="perfil-input"
                                    type="text"
                                    name="CEP"
                                    value={enderecos.Cep ?? ''}
                                    onChange={handleChangeEndereco}
                                    disabled={!isEditing}
                                    placeholder="00000-000"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Alert */}
                    {message && (
                        <div className={`perfil-alert ${status}`} style={{ marginTop: 0, marginBottom: 0, borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}>
                            <span className="msymbol">
                                {status === "success" ? "check_circle" : "error"}
                            </span>
                            {message}
                        </div>
                    )}

                    {/* Footer / Ações */}
                    <div className="perfil-footer">
                        {isEditing && (
                            <button className="perfil-btn-cancel" onClick={handleCancel}>
                                Cancelar
                            </button>
                        )}
                        <button className="perfil-btn-save" onClick={handleEditProfile}>
                            <span className="msymbol">
                                {isEditing ? "save" : "edit"}
                            </span>
                            {isEditing ? "Salvar Alterações" : "Editar Perfil"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PerfilDetails;