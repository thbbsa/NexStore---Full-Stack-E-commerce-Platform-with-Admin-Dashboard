import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  buscarProdutoPorId,
  atualizarProduto
} from "../../../services/produtoService";

import styles from './css/produtoEditar.module.css'

const EditarProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // DTO do formulário (editável)
  const [formProduto, setFormProduto] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProduto() {
      try {
        const data = await buscarProdutoPorId(id);

        // DTO normalizado
        setFormProduto({
          nome: data.produto.Nome || "",
          marca: data.produto.Marca || "",
          preco: data.produto.Preco || 0,
          precoPromocional: data.produto.PrecoPromocional || "",
          estoque: data.produto.Estoque || 0,
          categoriaId: data.produto.CategoriaId || 1,
          sku: data.produto.SKU || "",
          descricaoCurta: data.produto.DescricaoCurta || "",
          descricaoCompleta: data.produto.DescricaoCompleta || "",
          ativo: data.produto.Ativo ?? true
        });
      } catch (error) {
        console.error("Erro ao carregar produto", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProduto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormProduto(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await atualizarProduto(id, formProduto);
      alert("Produto atualizado com sucesso!");
      navigate("/dashboard/produtos");
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) return <p className="p-4">Carregando produto...</p>;
  if (!formProduto) return <p className="p-4">Produto não encontrado</p>;

  return (
    <div className={`${styles.containerProduto} container-fluid p-4`}>
      {/* Ações */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`${styles.pageTitle} mb-4`}>Editar Produto</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Informações Básicas */}
          <div className="col-lg-8 col-12 d-flex flex-column gap-4">
            <div className={`${styles.cardCustom} card mb-4"`}>
              <div className={`${styles.cardHeaderCustom} card-header`}>Informações Básicas</div>
              <div className="card-body row g-3">
                <div className="col-12">
                  <label className={`${styles.labelCustom} form-label`}>Nome Do Produto</label>
                  <input
                    type="text"
                    className={`${styles.inputCustom} form-control`}
                    name="nome"
                    value={formProduto.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className={`${styles.labelCustom} form-label`}>Categoria</label>
                  <select
                    className={`${styles.selectCustom} form-select`}
                    name="categoriaId"
                    value={formProduto.categoriaId}
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
                  <label className={`${styles.labelCustom} form-label`}>Marca</label>
                  <input
                    type="text"
                    className={`${styles.inputCustom} form-control`}
                    name="marca"
                    value={formProduto.marca}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            {/* Descrição */}
            <div className={`${styles.cardCustom} card mb-4`}>
              <div className={`${styles.cardHeaderCustom} card-header`}>Descrição</div>
              <div className="card-body">

                <div className="mb-3">
                  <label className={`${styles.labelCustom} form-label `}>Descrição curta</label>
                  <textarea
                    className={`${styles.inputCustom} form-control`}
                    rows="2"
                    name="descricaoCurta"
                    value={formProduto.descricaoCurta}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={`${styles.labelCustom} form-label`}>Descrição completa</label>
                  <textarea
                    className={`${styles.inputCustom} form-control`}
                    rows="4"
                    name="descricaoCompleta"
                    value={formProduto.descricaoCompleta}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>
          </div>

          <div className="col-lg-4 col-12">
            {/* Card: Status do Produto */}
            <div className={`${styles.cardCustom} card mb-4`}>
              <div className={`${styles.cardHeaderCustom} card-header`}>Status de Publicação</div>
              <div className="card-body">
                <div className="form-check form-switch py-1">
                  <input
                    className={`${styles.checkboxCustom} form-check-input`}
                    type="checkbox"
                    name="ativo"
                    checked={formProduto.ativo}
                    onChange={handleChange}
                  />
                  <label className={`${styles.labelCustom} form-check-label ms-2`} htmlFor="ativoCheckbox">
                    Ativo na Loja (Visível)
                  </label>
                </div>
              </div>
            </div>


            {/* Preço */}
            <div className={`${styles.cardCustom} card mb-4`}>
              <div className={`${styles.cardHeaderCustom} card-header`}>Preço</div>
              <div className="card-body row g-3">

                <div className="col-12">
                  <label className={`${styles.labelCustom} form-label`}>Preço</label>
                  <input
                    type="number"
                    className={`${styles.inputCustom} form-control`}
                    name="preco"
                    value={formProduto.preco}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className={`${styles.labelCustom} form-label`}>Preço Promocional</label>
                  <input
                    type="number"
                    className={`${styles.inputCustom} form-control `}
                    name="precoPromocional"
                    value={formProduto.precoPromocional}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            {/* Estoque */}
            <div className={`${styles.cardCustom} card mb-4`}>
              <div className={`${styles.cardHeaderCustom} card-header`}>Estoque</div>
              <div className="card-body row g-3">

                <div className="col-12">
                  <label className={`${styles.labelCustom} form-label`}>Quantidade</label>
                  <input
                    type="number"
                    className={`${styles.inputCustom} form-control`}
                    name="estoque"
                    value={formProduto.estoque}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className={`${styles.labelCustom} form-label`}>SKU</label>
                  <input
                    type="text"
                    className={`${styles.inputCustom} form-control`}
                    name="sku"
                    value={formProduto.sku}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="d-flex gap-3">
          <button
            type="button"
            className={`${styles.btnSecondary} btn px-4`}
            onClick={() => navigate("/dashboard/produtos")}
          >
            Cancelar
          </button>

          <button type="submit" className={`${styles.btnSuccess} btn px-4`}>
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarProduto;
