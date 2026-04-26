import React from "react";

const HeaderSearch = ({ busca, setBusca, onSubmit }) => (
    <div className="hdr-search">
        <form onSubmit={onSubmit}>
            <span className="msymbol" style={{ fontSize: 18, color: "var(--text-muted)" }}>search</span>
            <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar produtos..."
            />
            <button
                type="submit"
                disabled={!busca.trim()}
                className="hdr-search-btn"
            >
                <span className="msymbol" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
        </form>
    </div>
);

export default HeaderSearch;