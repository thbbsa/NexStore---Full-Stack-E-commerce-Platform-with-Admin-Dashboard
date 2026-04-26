import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h3 className="sidebar-title">Admin</h3>

            <nav className="sidebar-nav">

                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/dashboard/produtos"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="material-symbols-outlined">inventory_2</span>
                    Produtos
                </NavLink>

                <NavLink
                    to="/dashboard/produtos/novo"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="material-symbols-outlined">add_box</span>
                    Criar Produto
                </NavLink>

                <NavLink
                    to="/dashboard/usuarios"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="material-symbols-outlined">group</span>
                    Usuários
                </NavLink>

                <NavLink
                    to="/dashboard/pedidos"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Pedidos
                </NavLink>

                <NavLink
                    to="/logout"
                    className="sidebar-link logout"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Sair
                </NavLink>

            </nav>
        </aside>
    );
};

export default Sidebar;
