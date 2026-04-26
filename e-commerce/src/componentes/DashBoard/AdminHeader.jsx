import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminHeader = () => {
    return (
        <header
            className="admin-header d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
        >
            {/* Título da área */}
            <h2 className="m-0 fw-bold">Painel Administrativo</h2>

            {/* Ações do admin */}
            <div className="d-flex align-items-center">

                {/* Botão para criar produto */}


                <NavLink
                    to="/dashboard/produtos/novo"
                >
                    <button className="btn btn-primary me-3">
                        + Novo Produto
                    </button>
                </NavLink>


                {/* Ícone do admin */}
                <div className="admin-profile d-flex align-items-center">
                    <span className="material-symbols-outlined me-2" style={{ fontSize: "28px" }}>
                        account_circle
                    </span>
                    <span className="fw-semibold">Admin</span>
                </div>

            </div>

        </header>
    );
};

export default AdminHeader;
