import React, { useEffect, useState } from "react";
import Header from "../../componentes/Header/Header";
import { getMe, storeUser, getEndereco, UpdateEndereco } from '../../services/userService';
import "./PerfilDetails.css";

const PerfilDetails = () => {
    const [user, setUser] = useState({
        Id: '', Nome: '', Username: '', Email: '', Telefone: '', CPF: ''
    });

    const [endereco, setEndereco] = useState({
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

                const enderecoPrincipal = Array.isArray(enderecos)
                    ? enderecos.find(endereco => endereco.Principal)
                    : null;

                setOriginalEndereco(enderecoPrincipal || {});
                setEndereco(enderecoPrincipal || {});

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

    const verificarCamposMudados = (original, atual, id) => {
        const mudancas = {};

        for (const key in original) {
            if (key === id) {
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
        setEndereco(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setUser(originalUser);
        setEndereco(originalEndereco);
        setMessage("");
        setStatus("");
        setIsEditing(false);
    };

    const handleEditProfile = async () => {
        if (isEditing) {
            const isEqualUser =
                JSON.stringify(user) === JSON.stringify(originalUser);

            const isEqualEndereco =
                JSON.stringify(endereco) === JSON.stringify(originalEndereco);

            if (isEqualUser && isEqualEndereco) {
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

                const camposMudadosUser = verificarCamposMudados(
                    originalUser,
                    userToSend,
                    "Id"
                );

                const camposMudadosEndereco = verificarCamposMudados(
                    originalEndereco,
                    endereco,
                    "Id_endereco"
                );

                const semMudancaUser =
                    Object.keys(camposMudadosUser).length === 1;

                const semMudancaEndereco =
                    Object.keys(camposMudadosEndereco).length === 1;

                if (semMudancaUser && semMudancaEndereco) {
                    setMessage("Nenhuma alteração feita.");
                    setStatus("error");
                    setIsEditing(false);
                    return;
                }

                let userResponse = null;
                let enderecoResponse = null;

                if (!semMudancaUser) {
                    userResponse = await storeUser(camposMudadosUser);
                }

                if (!semMudancaEndereco) {
                    enderecoResponse = await UpdateEndereco(
                        camposMudadosEndereco
                    );
                }

                const userSuccess = userResponse?.ok;
                const enderecoSuccess = enderecoResponse?.ok;

                if (userSuccess || enderecoSuccess) {

                    let result = null;

                    if (userResponse) {
                        result = await userResponse.json();
                    } else if (enderecoResponse) {
                        result = await enderecoResponse.json();
                    }

                    setMessage(result?.message || "Perfil atualizado.");
                    setStatus("success");

                    setOriginalUser(user);
                    setOriginalEndereco(endereco);

                    setIsEditing(false);

                } else {

                    let errorData = null;

                    if (userResponse && !userResponse.ok) {
                        errorData = await userResponse.json();
                    } else if (
                        enderecoResponse &&
                        !enderecoResponse.ok
                    ) {
                        errorData = await enderecoResponse.json();
                    }

                    setMessage(
                        errorData?.message || "Erro ao atualizar perfil."
                    );

                    setStatus("error");
                }

            } catch (error) {
                console.error(
                    "Erro de rede ao atualizar perfil:",
                    error
                );

                setMessage("Erro de rede ao atualizar perfil.");
                setStatus("error");
            }

        } else {
            setMessage("");
            setStatus("");
            setIsEditing(true);
        }
    };

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
                        {endereco ? (
                            <div className="perfil-grid">

                                <div className="perfil-field span2">
                                    <label>Rua</label>
                                    <input
                                        className="perfil-input"
                                        type="text"
                                        name="Rua"
                                        value={endereco.Rua ?? ''}
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
                                        value={endereco.Numero ?? ''}
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
                                        value={endereco.Complemento ?? ''}
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
                                        value={endereco.Bairro ?? ''}
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
                                        value={endereco.Cidade ?? ''}
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
                                        value={endereco.Estado ?? ''}
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
                                        value={endereco.Cep ?? ''}
                                        onChange={handleChangeEndereco}
                                        disabled={!isEditing}
                                        placeholder="00000-000"
                                    />
                                </div>

                            </div>
                        ) : null}
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