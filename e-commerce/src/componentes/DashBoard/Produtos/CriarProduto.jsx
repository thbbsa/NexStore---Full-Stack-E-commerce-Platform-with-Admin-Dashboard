import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './produto.css'
import { Link } from "react-router-dom";

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
    const [statusProduto, setStatusProduto] = useState(false)
    const fileInputRef = useRef(null);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProduto({
            ...produto,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleImageChange = (e) => {
        setProduto({
            ...produto,
            imagem: e.target.files[0]
        });
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
        })

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const fecharMensagem = () => {
        setStatusProduto(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();;

        const formData = new FormData();

        // envia TODOS os dados do produto (sem a imagem)
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

        // envia a imagem separada
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
                clearInputs()
                setStatusProduto(true)
            } else {
                console.error("Erro do servidor:", result.message || result.error);
            }
        } catch (error) {
            console.error("Erro de rede:", error);
        }
    };

    return (
        <div className="containerProduto container-fluid p-4">

            <h2 className="mb-4">Criar Produto</h2>

            <form onSubmit={handleSubmit}>

                {/* Informações Básicas */}
                <div className="card mb-4">
                    <div className="card-header">Informações Básicas</div>
                    <div className="card-body row g-3">

                        <div className="col-md-6">
                            <label className="form-label">Nome do Produto</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nome"
                                value={produto.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Categoria</label>
                            <select
                                className="form-select"
                                name="categoria"
                                value={produto.categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione</option>
                                <option nome="Hardware" value="1">Hardware</option>
                                <option nome="Periféricos" value="2">Periféricos</option>
                                <option nome="Computadores" value="3">Computadores</option>
                                <option nome="Games" value="4">Games</option>
                                <option nome="Celular & Smartphone" value="5">Celular & Smartphone</option>
                                <option nome="Áudio" value="6">Áudio</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Marca</label>
                            <input
                                type="text"
                                className="form-control"
                                name="marca"
                                value={produto.marca}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                {/* Imagem */}
                <div className="card mb-4">
                    <div className="card-header">Imagem do Produto</div>
                    <div className="card-body">
                        <input
                            type="file"
                            className="form-control"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* Preço */}
                <div className="card mb-4">
                    <div className="card-header">Preço</div>
                    <div className="card-body row g-3">

                        <div className="col-md-6">
                            <label className="form-label">Preço</label>
                            <input
                                type="number"
                                className="form-control"
                                name="preco"
                                value={produto.preco}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Preço Promocional</label>
                            <input
                                type="number"
                                className="form-control"
                                name="precoPromocional"
                                value={produto.precoPromocional}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                {/* Estoque */}
                <div className="card mb-4">
                    <div className="card-header">Estoque</div>
                    <div className="card-body row g-3">

                        <div className="col-md-4">
                            <label className="form-label">Quantidade</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantidade"
                                value={produto.quantidade}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">SKU</label>
                            <input
                                type="text"
                                className="form-control"
                                name="sku"
                                value={produto.sku}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4 d-flex align-items-center mt-5">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="ativo"
                                    checked={produto.ativo}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">
                                    Produto ativo
                                </label>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Descrição */}
                <div className="card mb-4">
                    <div className="card-header">Descrição</div>
                    <div className="card-body">

                        <div className="mb-3">
                            <label className="form-label">Descrição curta</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                name="descricaoCurta"
                                value={produto.descricaoCurta}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div>
                            <label className="form-label">Descrição completa</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                name="descricaoCompleta"
                                value={produto.descricaoCompleta}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                    </div>
                </div>

                {/* Ações */}
                <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-success">
                        Salvar Produto
                    </button>
                    <button type="reset" className="btn btn-secondary">
                        Cancelar
                    </button>
                </div>

            </form>

            {statusProduto && (
                <div className="overlay d-flex justify-content-center align-items-center">
                    <div className="mensagemProdutoCriado d-flex flex-column align-items-center">
                        <button className="btn-fechar" onClick={fecharMensagem}>
                            ×
                        </button>
                        <span className="text-success">Produto criado com sucesso!</span>
                        <div className="d-flex m-3 gap-3">
                            <button className="btn btn-primary" onClick={fecharMensagem} >Cadastrar outro produto</button>
                            <Link to="/dashboard/produtos"><button className="btn btn-secondary">Ver lista de produtos</button></Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CriarProduto;
