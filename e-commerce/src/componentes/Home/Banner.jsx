import React from "react";
import banner from "../../assets/img/banner.png";
import "./banner.css";

const Banner = () => {
    return (
        <div className="banner-container">
            <img className="banner" src={banner} alt="Banner promocional" />
        </div>
    );
};

export default Banner;