import React from "react";

const checkbox = (props) => {
    return (
        <div>
            <input name={props.name} className={props.className} type="checkbox" id={props.id} />
            <label htmlFor={props.id}>{props.description}</label>
        </div>
    )
}

export default checkbox;