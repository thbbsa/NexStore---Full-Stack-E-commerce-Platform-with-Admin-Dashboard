import React, { useEffect } from "react";
import { useState } from "react";
import { getUsuarios } from "../../../services/usersService";


const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");


    useEffect(() => {
        const carregarUsuarios = async () => {
            const usuarios = await getUsuarios();

            setUsuarios(usuarios)
        }

        carregarUsuarios()
    }, [])

    const usuariosFiltrados = () => {
        return usuarios.filter((usuario) => {
            const atendePesquisa =
                usuario.Nome
                    .toLowerCase()
                    .includes(pesquisa.toLowerCase())
                ||
                usuario.Email
                    .toLowerCase()
                    .includes(pesquisa.toLowerCase())
                ||
                usuario.Username
                    .toLowerCase()
                    .includes(pesquisa.toLowerCase());

            const atendeFiltroTipo = filtroTipo ? usuario.Role === filtroTipo : true;
            const atendeFiltroStatus = filtroStatus ? usuario.Status === filtroStatus : true;

            return atendePesquisa && atendeFiltroTipo && atendeFiltroStatus;
        })
    }

    return (
        <div className="container-fluid mx-auto p-4 m-2 d-flex flex-column gap-4 text-white">
            <h1 className="text-2xl font-bold">Lista de Usuários</h1>

            {/* BUSCA */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <label className="form-label">Buscar</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nome, email ou username..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>

                {/* TIPO DE USUÁRIO */}
                <div className="col-6 col-md-3">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                {/* STATUS */}
                <div className="col-6 col-md-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
            </div>

            <table className="text-center p-2 w-100">
                <thead>
                    <tr className="bg-gray-300">
                        <th scope="col" className="border p-2">ID</th>
                        <th scope="col" className="border p-2">Nome</th>
                        <th scope="col" className="border p-2">Tipo</th>
                        <th scope="col" className="border p-2">Status</th>
                        <th scope="col" className="border p-2">Editar</th>
                        <th scope="col" className="border p-2">Desativar</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados().length > 0 ? (
                        usuariosFiltrados().map((usuario) => (
                            <tr key={usuario.Id} className="bg-gray-200">
                                <td className="border p-2">{usuario.Id}</td>
                                <td className="border p-2">{usuario.Nome}</td>
                                <td className="border p-2">{usuario.Role}</td>
                                <td className="border p-2">{usuario.Status}</td>
                                <td className="border p-2">
                                    <button className="btn btn-primary text-white font-bold py-2 px-4 rounded">
                                        Editar
                                    </button>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => console.log(`Desativar usuário ${usuario.Id}`)}
                                        className="btn btn-outline-danger text-white font-bold py-2 px-4 rounded"
                                    >
                                        Desativar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="border p-2 text-center">
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaUsuario;