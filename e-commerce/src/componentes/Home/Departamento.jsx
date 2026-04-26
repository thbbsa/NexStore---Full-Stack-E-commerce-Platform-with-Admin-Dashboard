import React from "react";
import "./departamento.css";

const Departamentos = ({ src, name, onClick }) => {
    return (
        <div className="departamento-item d-flex flex-column align-items-center mx-4">
            <div className="departamento-img-wrapper mb-2">
                <img src={src} alt={name} className="departamento-img" onClick={onClick} />
            </div>
            <h2 className="departamento-nome">{name}</h2>
        </div>
    );
};

export default Departamentos;