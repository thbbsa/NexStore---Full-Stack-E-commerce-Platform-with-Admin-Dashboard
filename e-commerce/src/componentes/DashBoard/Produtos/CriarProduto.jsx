import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

// Importa o CSS Module
import styles from "./css/produto.module.css";

const CriarProduto = () => {
    const [produto, setProduto] = useState({
        nome: "",
        categoria: "",
        marca: "",
        preco: "",
        precoPromocional: "",
        quantidade: "",
        sku: "",
        ativo: false,
        descricaoCurta: "",
        descricaoCompleta: "",
        imagem: null
    });
    const [imagePreview, setImagePreview] = useState(null); // Preview da Imagem
    const [statusProduto, setStatusProduto] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduto({
            ...produto,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduto({ ...produto, imagem: file });
            setImagePreview(URL.createObjectURL(file)); // Gera URL temporária para o preview
        }
    };

    const clearInputs = () => {
        setProduto({
            nome: "",
            categoria: "",
            marca: "",
            preco: "",
            precoPromocional: "",
            quantidade: "",
            sku: "",
            ativo: false,
            descricaoCurta: "",
            descricaoCompleta: "",
            imagem: null
        });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const fecharMensagem = () => {
        setStatusProduto(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append(
            "produto",
            JSON.stringify({
                nome: produto.nome,
                categoria: produto.categoria,
                marca: produto.marca,
                preco: produto.preco,
                precoPromocional: produto.precoPromocional,
                quantidade: produto.quantidade,
                sku: produto.sku,
                ativo: produto.ativo,
                descricaoCurta: produto.descricaoCurta,
                descricaoCompleta: produto.descricaoCompleta
            })
        );

        if (produto.imagem) {
            formData.append("imagem", produto.imagem);
        }

        try {
            const response = await fetch("http://localhost:3000/api/produtos", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                clearInputs();
                setStatusProduto(true);
            } else {
                console.error("Erro do servidor:", result.message || result.error);
            }
        } catch (error) {
            console.error("Erro de rede:", error);
        }
    };

    return (
        <div className={`${styles.containerProduto} container-fluid p-4`}>
            
            {/* Cabeçalho alinhado com as ações */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className={`${styles.pageTitle} m-0`}>Criar Produto</h2>
                <div className="d-flex gap-3">
                    <button type="button" onClick={clearInputs} className={`${styles.btnSecondary} btn px-4`}>
                        Cancelar
                    </button>
                    <button type="submit" form="formProduto" className={`${styles.btnSuccess} btn px-4`}>
                        Salvar Produto
                    </button>
                </div>
            </div>

            <form id="formProduto" onSubmit={handleSubmit}>
                <div className="row g-4">
                    
                    {/* COLUNA DA ESQUERDA: Informações textuais (Largura 8 de 12) */}
                    <div className="col-lg-8 col-12">
                        
                        {/* Card: Informações Básicas */}
                        <div className={`${styles.cardCustom} card mb-4`}>
                            <div className={`${styles.cardHeaderCustom} card-header`}>Informações Gerais</div>
                            <div className="card-body row g-3">
                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`}>Nome do Produto</label>
                                    <input
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="nome"
                                        value={produto.nome}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Teclado Mecânico RGB"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`}>Categoria</label>
                                    <select
                                        className={`${styles.selectCustom} form-select`}
                                        name="categoria"
                                        value={produto.categoria}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        <option value="1">Hardware</option>
                                        <option value="2">Periféricos</option>
                                        <option value="3">Computadores</option>
                                        <option value="4">Games</option>
                                        <option value="5">Celular & Smartphone</option>
                                        <option value="6">Áudio</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className={`${styles.labelCustom} form-label`}>Marca</label>
                                    <input
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="marca"
                                        value={produto.marca}
                                        onChange={handleChange}
                                        placeholder="Ex: Logitech"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card: Descrição */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header`}>Descrição do Produto</div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className={`${styles.labelCustom} form-label`}>Descrição Curta</label>
                                    <textarea
                                        className={`${styles.inputCustom} form-control`}
                                        rows="2"
                                        name="descricaoCurta"
                                        value={produto.descricaoCurta}
                                        onChange={handleChange}
                                        placeholder="Resumo rápido para listagens..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className={`${styles.labelCustom} form-label`}>Descrição Detalhada</label>
                                    <textarea
                                        className={`${styles.inputCustom} form-control`}
                                        rows="6"
                                        name="descricaoCompleta"
                                        value={produto.descricaoCompleta}
                                        onChange={handleChange}
                                        placeholder="Especificações técnicas e detalhes completos..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* COLUNA DA DIREITA: Mídia, Preços e Estoque (Largura 4 de 12) */}
                    <div className="col-lg-4 col-12">
                        
                        {/* Card: Status do Produto */}
                        <div className={`${styles.cardCustom} card mb-4`}>
                            <div className={`${styles.cardHeaderCustom} card-header`}>Status de Publicação</div>
                            <div className="card-body">
                                <div className="form-check form-switch py-1">
                                    <input
                                        className={`${styles.checkboxCustom} form-check-input`}
                                        type="checkbox"
                                        role="switch"
                                        name="ativo"
                                        id="ativoCheckbox"
                                        checked={produto.ativo}
                                        onChange={handleChange}
                                    />
                                    <label className={`${styles.labelCustom} form-check-label ms-2`} htmlFor="ativoCheckbox">
                                        Ativo na Loja (Visível)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Card: Imagem do Produto (com Box de Preview) */}
                        <div className={`${styles.cardCustom} card mb-4`}>
                            <div className={`${styles.cardHeaderCustom} card-header`}>Mídia</div>
                            <div className="card-body text-center">
                                {imagePreview ? (
                                    <div className={styles.previewContainer}>
                                        <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                                        <button 
                                            type="button" 
                                            className={`${styles.btnRemoveImage} btn btn-danger btn-sm`}
                                            onClick={() => { setImagePreview(null); setProduto({...produto, imagem: null}); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                                        >
                                            Remover Imagem
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.uploadPlaceholder} onClick={() => fileInputRef.current.click()}>
                                        <i className="bi bi-image" style={{ fontSize: "2rem", color: "var(--text-muted)" }}></i>
                                        <p className="m-0 mt-2 text-muted" style={{ fontSize: "0.85rem" }}>Clique para carregar imagem</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="d-none"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {/* Card: Preços */}
                        <div className={`${styles.cardCustom} card mb-4`}>
                            <div className={`${styles.cardHeaderCustom} card-header`}>Preços</div>
                            <div className="card-body row g-3">
                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`}>Preço de Venda (R$)</label>
                                    <input
                                        type="number"
                                        className={`${styles.inputCustom} form-control`}
                                        name="preco"
                                        value={produto.preco}
                                        onChange={handleChange}
                                        required
                                        placeholder="0,00"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`}>Preço Promocional (R$)</label>
                                    <input
                                        type="number"
                                        className={`${styles.inputCustom} form-control`}
                                        name="precoPromocional"
                                        value={produto.precoPromocional}
                                        onChange={handleChange}
                                        placeholder="0,00 (Opcional)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card: Estoque */}
                        <div className={`${styles.cardCustom} card`}>
                            <div className={`${styles.cardHeaderCustom} card-header`}>Estoque e Identificação</div>
                            <div className="card-body row g-3">
                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`}>Quantidade disponível</label>
                                    <input
                                        type="number"
                                        className={`${styles.inputCustom} form-control`}
                                        name="quantidade"
                                        value={produto.quantidade}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className={`${styles.labelCustom} form-label`}>SKU / Código</label>
                                    <input
                                        type="text"
                                        className={`${styles.inputCustom} form-control`}
                                        name="sku"
                                        value={produto.sku}
                                        onChange={handleChange}
                                        placeholder="Ex: TEC-LOG-01"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>

            {/* Modal de Sucesso */}
            {statusProduto && (
                <div className={styles.overlay}>
                    <div className={styles.mensagemProdutoCriado}>
                        <button className={styles.btnFechar} onClick={fecharMensagem}>&times;</button>
                        <span className={styles.mensagemSucessoTexto}>Produto criado com sucesso!</span>
                        <div className="d-flex m-3 gap-3">
                            <button className={`${styles.btnSuccess} btn`} onClick={fecharMensagem}>
                                Cadastrar outro
                            </button>
                            <Link to="/dashboard/produtos" className={`${styles.btnSecondary} btn`}>
                                Ver lista de produtos
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CriarProduto;