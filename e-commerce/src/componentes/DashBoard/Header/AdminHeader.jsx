import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./css/AdminHeader.module.css"; 

import "../cssGlobal/dashboardTheme.css"; 

const AdminHeader = () => {
    return (
        <header className={`${styles.header} d-flex justify-content-between align-items-center px-4 py-3`}>
            <h2 className={`${styles.title} m-0 fw-bold`}>Painel Administrativo</h2>
            <div className="d-flex align-items-center">
                <NavLink
                    to="/dashboard/produtos/novo"
                    className={`${styles.btnPrimary} btn me-3 d-flex align-items-center`}
                >
                    + Novo Produto
                </NavLink>

                {/* Ícone do perfil do admin */}
                <div className={`${styles.profile} d-flex align-items-center`}>
                    <i className="bi bi-person-circle me-2" style={{ fontSize: "24px" }}></i>
                    <span className="fw-semibold">Admin</span>
                </div>

            </div>
        </header>
    );
};

export default AdminHeader;