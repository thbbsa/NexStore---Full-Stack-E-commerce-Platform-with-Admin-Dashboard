import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Input = (props) => <input name={props.name} className={props.className} type={props.type} placeholder={props.description} />;
export default Input;
