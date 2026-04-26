import React, { useState } from "react";

const EnderecoModal = ({ enderecos, enderecoSelecionado, setEnderecoSelecionado, onConfirmar, onFechar }) => {
    const [cep, setCep] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");

    function handleConfirmar() {
        onConfirmar(cep, numero, complemento);
        onFechar();
    }

    const podeSalvar = cep.trim() || enderecoSelecionado !== null;

    return (
        <div className="cep-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
            <div className="cep-modal">

                <div className="cep-modal-header">
                    <div className="cep-modal-icon">
                        <span className="msymbol">location_on</span>
                    </div>
                    <div>
                        <h3 className="cep-modal-title">Endereço de entrega</h3>
                        <p className="cep-modal-sub">Informe onde quer receber seus pedidos</p>
                    </div>
                    <button className="cep-modal-close" onClick={onFechar}>
                        <span className="msymbol">close</span>
                    </button>
                </div>

                <div className="cep-modal-body">

                    {/* Lista de endereços salvos */}
                    <div className="ck-addr-list">
                        {enderecos.map((e) => (
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

                    {/* Novo endereço por CEP */}
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
                            <label>
                                Complemento <span className="cep-optional">opcional</span>
                            </label>
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
                    <button className="cep-btn-cancel" onClick={onFechar}>
                        Cancelar
                    </button>
                    <button
                        className="cep-btn-confirm"
                        disabled={!podeSalvar}
                        onClick={handleConfirmar}
                    >
                        <span className="msymbol">check</span>
                        Confirmar endereço
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EnderecoModal;