import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Button = (props) => (
    <button
        name={props.name}
        type={props.type}
        className={props.className}
        onClick={props.onClick}
        disabled={props.disabled}
    >
        {props.name}
    </button>
);

export default Button;
