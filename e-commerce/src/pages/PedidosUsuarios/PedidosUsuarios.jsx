import React, { useEffect, useState } from "react"
import './PedidosUsuarios.css'
import { getPedidos } from "../../services/userService"
import Header from "../../componentes/Header/Header.jsx";
import { useNavigate } from "react-router-dom";

export default function PedidoUsuarios() {
    const navigate = useNavigate()

    const [pedidos, setPedidos] = useState([])
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [pesquisa, setPesquisa] = useState("")
    const [filtroPeriodo, setFiltroPeriodo] = useState("")
    const [filtroStatus, setFiltroStatus] = useState("")


    useEffect(() => {
        const buscarPedidos = async () => {
            const response = await getPedidos()

            setPedidos(response.pedidos);
        }

        buscarPedidos();
    }, [])


    const itensPorPagina = 5;
    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const indiceFinal = indiceInicial + itensPorPagina;

    const pedidosFiltrados = pedidos.filter((pedido) => {
        const atendePesquisa =
            pedido.ProdutoNome
                .toLowerCase()
                .includes(pesquisa.toLowerCase())
            ||
            (`#${String(pedido.PedidoId).padStart(5, "0")}`)
                .toLowerCase()
                .includes(pesquisa.toLowerCase());

        const atendeStatus =
            filtroStatus === "todos" ||
            filtroStatus === "" ||
            pedido.PedidoStatus?.toLowerCase() === filtroStatus.toLowerCase();

        let atendePeriodo = true;

        if (filtroPeriodo && filtroPeriodo !== "todos") {
            const dataPedido = new Date(pedido.DataPedido);
            const limite = new Date();

            switch (filtroPeriodo) {
                case "3meses":
                    limite.setMonth(limite.getMonth() - 3);
                    break;

                case "6meses":
                    limite.setMonth(limite.getMonth() - 6);
                    break;

                case "1ano":
                    limite.setFullYear(limite.getFullYear() - 1);
                    break;

                case "2anos":
                    limite.setFullYear(limite.getFullYear() - 2);
                    break;
            }

            atendePeriodo = dataPedido >= limite;
        }

        return (
            atendePesquisa &&
            atendeStatus &&
            atendePeriodo
        );
    });

    const pedidosPagina = pedidosFiltrados.slice(
        indiceInicial,
        indiceFinal
    );

    const totalPaginas = Math.ceil(
        pedidos.length / itensPorPagina
    );


    return (

        <div className="container-global">
            <Header />
            <div className="container-pedidos">
                <h1>Meus pedidos</h1>
                <hr />

                <div className="container-busca">
                    <div className="input-group">
                        <input type="text" id="busca-pedido" placeholder=" " value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
                        <label htmlFor="busca-pedido">Nome ou número do pedido</label>
                    </div>

                    <div className="container-filtros">
                        <select name="filtro-tempo" id="filtro-tempo" value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
                            <option value="" disabled>Período</option>
                            <option value="3meses">Últimos 3 meses</option>
                            <option value="6meses">Últimos 6 meses</option>
                            <option value="1ano">Último ano</option>
                            <option value="2anos">Últimos 2 anos</option>
                            <option value="todos">Todos</option>
                        </select>

                        <select name="filtro-status" id="filtro-status" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="" disabled>Status</option>
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="enviado">Enviado</option>
                            <option value="transito">Em trânsito</option>
                            <option value="entregue">Entregue</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                </div>

                <div className="container-pedidos">
                    {pedidosPagina.map(pedido => (
                        <div className="card-pedido" key={pedido.PedidoId}>
                            <div className="container-header">
                                <div className="info-pedido">
                                    <h2>Pedido #{String(pedido.PedidoId).padStart(5, "0")}</h2>
                                    <span className="separador">•</span>
                                    <span className="data-pedido">{new Date(pedido.DataPedido).toLocaleDateString("pt-BR")}</span>
                                </div>
                                <span className="badge badge-concluido">{pedido.PedidoStatus}</span>
                            </div>

                            <hr />

                            <div className="container-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Pagamento</span>
                                    <span className="meta-valor">{pedido.MetodoPagamento}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Entrega</span>
                                    <span className="meta-valor">{pedido.StatusPagamento}</span>
                                </div>
                            </div>

                            <hr />

                            <div className="container-body">
                                <div className="produto-img-wrap">
                                    <img src={`http://localhost:3000${pedido.Imagem}`} alt={pedido.ProdutoNome} />
                                </div>

                                <div className="info-produto">
                                    <span className="vendedor">Vendido e entregue por E-commerce!</span>
                                    <h3>
                                        {pedido.ProdutoNome}
                                    </h3>
                                    <span className="quantidade">Quantidade: {pedido.Quantidade}</span>
                                </div>
                            </div>

                            <hr />

                            <div className="container-botoes">
                                <button className="btn-secundario">Gerenciar pedido</button>
                                <button onClick={() => navigate(`/detalhe-pedido/${pedido.PedidoId}`)} className="btn-primario">Ver detalhes</button>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="container-paginacao">
                    {[...Array(totalPaginas)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setPaginaAtual(index + 1)}
                            className={paginaAtual === index + 1 ? "ativo" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}