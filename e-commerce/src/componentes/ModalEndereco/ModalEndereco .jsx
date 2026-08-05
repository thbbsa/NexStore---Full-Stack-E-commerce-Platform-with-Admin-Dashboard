import React, { useState, useEffect } from "react";
import styles from "./css/ModalEndereco.module.css";

const ModalEndereco = ({ endereco, onClose, onSalvar }) => {
    const [dados, setDados] = useState({
        Rua: "",
        Numero: "",
        Complemento: "",
        Bairro: "",
        Cidade: "",
        Estado: "",
        Cep: "",
        Principal: false,
    });

    const [buscandoCep, setBuscandoCep] = useState(false);
    const [erroCep, setErroCep] = useState("");

    // Pré-popula se estiver editando
    useEffect(() => {
        if (endereco) {
            setDados({
                Rua: endereco.Rua || "",
                Numero: endereco.Numero || "",
                Complemento: endereco.Complemento || "",
                Bairro: endereco.Bairro || "",
                Cidade: endereco.Cidade || "",
                Estado: endereco.Estado || "",
                Cep: endereco.Cep || "",
                Principal: endereco.Principal || false,
            });
        }
    }, [endereco]);

    const limparCep = (valor = "") => valor.replace(/\D/g, "").slice(0, 8);

    const formatarCep = (valor = "") => {
        const digitos = limparCep(valor);
        return digitos.replace(/^(\d{0,5})(\d{0,3})$/, (_, a, b) =>
            [a, b && `-${b}`].filter(Boolean).join("")
        );
    };

    const buscarEnderecoPorCep = async (cep) => {
        setBuscandoCep(true);
        setErroCep("");

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                setErroCep("CEP não encontrado.");
                return;
            }

            setDados((prev) => ({
                ...prev,
                Rua: data.logradouro || prev.Rua,
                Bairro: data.bairro || prev.Bairro,
                Cidade: data.localidade || prev.Cidade,
                Estado: data.uf || prev.Estado,
            }));
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setErroCep("Não foi possível buscar o CEP agora.");
        } finally {
            setBuscandoCep(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "Cep") {
            const cepLimpo = limparCep(value);
            setDados((prev) => ({ ...prev, Cep: cepLimpo }));
            setErroCep("");

            if (cepLimpo.length === 8) {
                buscarEnderecoPorCep(cepLimpo);
            }
            return;
        }

        setDados((prev) => ({ ...prev, [name]: value }));
    };

    const handleTogglePrincipal = () => {
        setDados((prev) => ({ ...prev, Principal: !prev.Principal }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSalvar(dados);
    };

    // Fecha ao clicar fora do card (no overlay)
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const editando = !!endereco;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modalCard}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        <span className="material-symbols-outlined fs-5">location_on</span>
                        {editando ? "Editar endereço" : "Adicionar endereço"}
                    </h3>
                    <button type="button" className={styles.btnFechar} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className={styles.labelCustom}>CEP</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Cep"
                                    value={formatarCep(dados.Cep)}
                                    onChange={handleChange}
                                    placeholder="00000-000"
                                />
                                {buscandoCep && (
                                    <small className={styles.textMuted}>Buscando endereço...</small>
                                )}
                                {erroCep && (
                                    <small className="text-danger">{erroCep}</small>
                                )}
                            </div>
                            <div className="col-md-5">
                                <label className={styles.labelCustom}>Cidade</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Cidade"
                                    value={dados.Cidade}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className={styles.labelCustom}>Estado</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Estado"
                                    value={dados.Estado}
                                    onChange={handleChange}
                                    maxLength={2}
                                    required
                                />
                            </div>
                            <div className="col-md-8">
                                <label className={styles.labelCustom}>Rua</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Rua"
                                    value={dados.Rua}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className={styles.labelCustom}>Número</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Numero"
                                    value={dados.Numero}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className={styles.labelCustom}>Complemento</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Complemento"
                                    value={dados.Complemento}
                                    onChange={handleChange}
                                    placeholder="Apto, bloco, referência..."
                                />
                            </div>
                            <div className="col-md-6">
                                <label className={styles.labelCustom}>Bairro</label>
                                <input
                                    className={styles.inputCustom}
                                    name="Bairro"
                                    value={dados.Bairro}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 d-flex align-items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="principal"
                                    checked={dados.Principal}
                                    onChange={handleTogglePrincipal}
                                />
                                <label htmlFor="principal" className={styles.labelCustom} style={{ margin: 0 }}>
                                    Definir como endereço principal
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnSecondary} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnPrimary}>
                            {editando ? "Salvar alterações" : "Adicionar endereço"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEndereco;