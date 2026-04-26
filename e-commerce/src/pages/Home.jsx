import { React } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Header from "../componentes/Home/Header.jsx";
import Banner from "../componentes/Home/Banner.jsx";
import Departamento from "../componentes/Home/Departamento.jsx";
import ProductList from "../componentes/Home/ProductList.jsx";

import hardware from "../assets/img/hardware.webp";
import perifericos from "../assets/img/perifericos.png";
import computadores from "../assets/img/computadores.png";
import games from "../assets/img/games.png";
import celularSmartPhone from "../assets/img/celularSmartPhone.png";
import audio from "../assets/img/audio.png";

import "bootstrap/dist/css/bootstrap.min.css";

const departamentos = [
    { id: 1, src: hardware, name: "Hardware" },
    { id: 2, src: perifericos, name: "Periféricos" },
    { id: 3, src: computadores, name: "Computadores" },
    { id: 4, src: games, name: "Games" },
    { id: 5, src: celularSmartPhone, name: "Celular & Smartphone" },
    { id: 6, src: audio, name: "Áudio" }
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column">
            <Header />
            <Banner />

            {/* SEÇÃO DE DEPARTAMENTOS */}
            <section className="container mt-5">
                <h2 className="text-center fw-bold mb-4">
                    Explore por Departamento
                </h2>

                <div className="d-flex justify-content-center flex-wrap gap-4">
                    {departamentos.map((dep, index) => (
                        <Departamento 
                            key={index}
                            src={dep.src}
                            name={dep.name}
                            onClick={() => navigate(`/produtos?categoria=${dep.id}`)}
                        />
                    ))} 
                </div>
            </section>

            <ProductList></ProductList>

        </div>
    );
};

export default Home;
