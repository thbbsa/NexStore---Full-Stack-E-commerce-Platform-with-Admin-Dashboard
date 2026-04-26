import React from "react";
import { Link } from "react-router-dom";
import "./breadCrumb.css"

const Breadcrumb = ({ paths }) => {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb">
        {paths.map((p, index) => {
          const isLast = index === paths.length - 1;

          const label = typeof p === "object" && p.name ? p.name : p;
          const link = typeof p === "object" && p.link ? p.link : "#";

          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast ? label : <Link to={link}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

