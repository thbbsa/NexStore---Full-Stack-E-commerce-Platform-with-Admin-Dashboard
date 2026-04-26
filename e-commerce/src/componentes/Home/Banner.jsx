import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import banner from "../../assets/img/banner.png";
import "../../css/home.css";

const Banner = () => {
    return <div className="banner-container">
        <img className="banner" src={banner} alt="" />
    </div>
};

export default Banner;
