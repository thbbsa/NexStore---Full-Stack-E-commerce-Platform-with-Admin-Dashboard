import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { excluirProduto } from "../../../services/produtoService";
import { useNavigate } from "react-router-dom";
import {
  buscarProdutosAdmin,
} from "../../../services/produtoService";

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
  // Exclusão
  // ===============================

  const handleExcluirProduto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await excluirProduto(id);
      setProdutos(prev => prev.filter(p => p.Id !== id));
    } catch {
      alert("Erro ao excluir produto");
    }
  };

  // ===============================
  // Editar
  // ===============================

  const handleEditarProduto = (id) => {
    navigate(`/dashboard/produtos/editar/${id}`)
  }

  return (
    <div className="container-fluid p-4">

      {/* TÍTULO */}
      <h1 className="mb-4">Listar Produtos</h1>

      {/* FILTROS */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">

            {/* BUSCA */}
            <div className="col-12 col-md-6">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar produtos..."
                value={produtoBuscado}
                onChange={(e) => {
                  setProdutoBuscado(e.target.value);
                  setPaginaAtual(1);
                }}
              />
            </div>

            {/* CATEGORIA */}
            <div className="col-6 col-md-3">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={categoriaSelecionada}
                onChange={(e) => {
                  setCategoriaSelecionada(e.target.value);
                  setPaginaAtual(1);
                }}
              >
                <option value="">Todas</option>
                <option nome="Hardware" value="1">Hardware</option>
                <option nome="Periféricos" value="2">Periféricos</option>
                <option nome="Computadores" value="3">Computadores</option>
                <option nome="Games" value="4">Games</option>
                <option nome="Celular & Smartphone" value="5">Celular & Smartphone</option>
                <option nome="Áudio" value="6">Áudio</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="col-6 col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
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
      <div className="row w-100">
        {produtosPaginados.length > 0 ? (
          produtosPaginados.map((produto) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={produto.Id}>
              <div className="card h-100 shadow-sm">

                <img
                  src={`http://localhost:3000${produto.Imagem}`}
                  className="card-img-top"
                  alt={produto.Nome}
                  style={{ height: "300px",  }}
                />

                <div className="card-body d-flex flex-column">

                  <h5 className="card-title">{produto.Nome}</h5>

                  <span className="badge bg-secondary mb-2">
                    {produto.Categoria}
                  </span>

                  <p className="mb-2">
                    {produto.PrecoPromocional ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          R$ {produto.Preco}
                        </span>
                        <span className="fw-bold text-success">
                          R$ {produto.PrecoPromocional}
                        </span>
                      </>
                    ) : (
                      <span className="fw-bold">
                        R$ {produto.Preco}
                      </span>
                    )}
                  </p>

                  <span
                    className={`badge ${produto.Ativo ? "bg-success" : "bg-danger"
                      }`}
                  >
                    {produto.Ativo ? "Ativo" : "Inativo"}
                  </span>

                  <div className="mt-auto d-flex gap-2 pt-3">
                    <button className="btn btn-sm btn-primary w-100" onClick={(e) => handleEditarProduto(produto.Id)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger w-100" onClick={(e) => handleExcluirProduto(produto.Id)}>
                      Excluir
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
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
                className={`page-item ${paginaAtual === index + 1 ? "active" : ""
                  }`}
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
              className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""
                }`}
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
