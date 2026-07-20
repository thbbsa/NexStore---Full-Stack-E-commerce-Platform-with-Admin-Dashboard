import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  desativarProduto,
  buscarProdutosAdmin,
} from "../../../services/produtoService";

import styles from './css/produtoLista.module.css'

const ListaProduto = () => {
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [produtoBuscado, setProdutoBuscado] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");

  const navigate = useNavigate();

  const itensPorPagina = 10;

  // ===============================
  // BUSCAR PRODUTOS
  // ===============================
  const buscarTodosProdutos = async () => {
    try {
      const response = await buscarProdutosAdmin();

      setProdutos(response);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    buscarTodosProdutos();
  }, []);

  // ===============================
  // FILTROS
  // ===============================
  const produtosFiltrados = produtos.filter((produto) => {
    const nomeMatch =
      produtoBuscado === "" ||
      produto.Nome.toLowerCase().includes(produtoBuscado.toLowerCase());

    const categoriaMatch =
      categoriaSelecionada === "" ||
      produto.CategoriaId === Number(categoriaSelecionada);

    const statusMatch =
      statusSelecionado === "" ||
      (statusSelecionado === "ativo" && produto.Ativo) ||
      (statusSelecionado === "inativo" && !produto.Ativo);

    return nomeMatch && categoriaMatch && statusMatch;
  });

  // ===============================
  // PAGINAÇÃO
  // ===============================
  const indiceFinal = paginaAtual * itensPorPagina;
  const indiceInicial = indiceFinal - itensPorPagina;

  const produtosPaginados = produtosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  const totalPaginas = Math.ceil(
    produtosFiltrados.length / itensPorPagina
  );

  // ===============================
  // Desativação
  // ===============================

  const handleDesativarProduto = async (id) => {
    if (!window.confirm("Tem certeza que deseja desativar este produto?")) return;

    try {
      await desativarProduto(id);
      setProdutos(prev => prev.map(produto => produto.Id === id ? { ...produto, Ativo: false } : produto));
    } catch {
      alert("Erro ao desativar produto");
    }
  };

  // ===============================
  // Editar
  // ===============================

  const handleEditarProduto = (id) => {
    navigate(`/dashboard/produtos/editar/${id}`)
  }

  // ===============================
  // Helper de desconto
  // ===============================
  const calcularDesconto = (preco, precoPromocional) => {
    if (!precoPromocional) return null;
    return Math.round(((preco - precoPromocional) / preco) * 100);
  };

  return (
    <div className={`${styles.container} p-4`}>

      {/* TÍTULO */}
      <h1 className="mb-4">Listar Produtos</h1>

      {/* FILTROS */}
      <div className={`${styles.filtersCard} p-4 mb-4`}>
        <div className="card-body">
          <div className="row g-3">

            {/* BUSCA */}
            <div className="col-12 col-md-6">
              <div className={styles.inputGroup}>
                <span className="ps-3 text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar produtos pelo nome..."
                  value={produtoBuscado}
                  onChange={(e) => {
                    setProdutoBuscado(e.target.value);
                    setPaginaAtual(1);
                  }}
                />
              </div>
            </div>

            {/* CATEGORIA */}
            <div className="col-6 col-md-3">
              <select
                className={`${styles.select} form-select`}
                value={categoriaSelecionada}
                onChange={(e) => {
                  setCategoriaSelecionada(e.target.value);
                  setPaginaAtual(1);
                }}
              >
                <option value="">Todas</option>
                <option value="1">Hardware</option>
                <option value="2">Periféricos</option>
                <option value="3">Computadores</option>
                <option value="4">Games</option>
                <option value="5">Celular & Smartphone</option>
                <option value="6">Áudio</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="col-6 col-md-3">
              <select
                className={`${styles.select} form-select`}
                value={statusSelecionado}
                onChange={(e) => {
                  setStatusSelecionado(e.target.value);
                  setPaginaAtual(1);
                }}
              >
                <option value="">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="row">
        {produtosPaginados.length > 0 ? (
          produtosPaginados.map((produto) => {
            const desconto = calcularDesconto(produto.Preco, produto.PrecoPromocional);
            const estoqueBaixo = produto.Estoque > 0 && produto.Estoque <= 5;
            const semEstoque = produto.Estoque === 0;

            return (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={produto.Id}>
                <div className={`${styles.containerCard} h-100`}>

                  {/* IMAGEM */}
                  <img
                    src={`http://localhost:3000${produto.Imagem}`}
                    className={styles.imagemProduto}
                    alt={produto.Nome}
                  />

                  {/* BADGES SOBRE A IMAGEM */}
                  <span
                    className={`${styles.statusProduto} badge ${produto.Ativo ? "bg-success" : "bg-danger"}`}
                  >
                    {produto.Ativo ? "Ativo" : "Inativo"}
                  </span>

                  {desconto > 0 && (
                    <span className={`${styles.descontoPorcentagem} badge bg-danger`}>
                      -{desconto}%
                    </span>
                  )}

                  <div className={`${styles.cardBodyInner} d-flex flex-column`}>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className={styles.infoSKU}>SKU: {produto.SKU}</span>
                      <span className="badge bg-secondary">{produto.Categoria}</span>
                    </div>

                    <h5 className="card-title">{produto.Nome}</h5>

                    <p className={styles.containerPreco}>
                      {produto.PrecoPromocional ? (
                        <>
                          <span className={`${styles.precoAntigo} text-decoration-line-through`}>
                            R$ {produto.Preco.toFixed(2)}
                          </span>
                          <span className={`${styles.precoAtual} fw-bold text-success`}>
                            R$ {produto.PrecoPromocional.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className={`${styles.precoAtual} fw-bold`}>
                          R$ {produto.Preco.toFixed(2)}
                        </span>
                      )}
                    </p>

                    <div className={`${styles.infoEstoque} ${semEstoque ? styles.estoqueZerado : estoqueBaixo ? styles.estoqueBaixo : ""}`}>
                      <i className="bi bi-box-seam"></i>
                      <span>Estoque: <strong>{produto.Estoque} unidades</strong></span>
                    </div>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className={`btn btn-primary w-100 d-flex align-items-center justify-content-center gap-1 ${styles.botaoAcao}`}
                        onClick={() => handleEditarProduto(produto.Id)}
                      >
                        <i className="bi bi-pencil"></i>
                        Editar
                      </button>
                      <button
                        className={`btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1 ${styles.botaoAcao}`}
                        onClick={() => handleDesativarProduto(produto.Id)}
                      >
                        <i className="bi bi-slash-circle"></i>
                        Desativar
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="card-body text-white text-center">
              Nenhum produto encontrado
            </div>
          </div>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <nav>
          <ul className="pagination justify-content-center">

            <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaAtual(paginaAtual - 1)}
              >
                Anterior
              </button>
            </li>

            {[...Array(totalPaginas)].map((_, index) => (
              <li
                key={`pagina-${index + 1}`}
                className={`page-item ${paginaAtual === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaAtual(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPaginaAtual(paginaAtual + 1)}
              >
                Próxima
              </button>
            </li>

          </ul>
        </nav>
      )}

    </div>
  );
};

export default ListaProduto;