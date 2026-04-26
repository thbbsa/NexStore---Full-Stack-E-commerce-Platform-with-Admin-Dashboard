import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CarrinhoContext } from "../../context/Carrinho/CarrinhoContext";
import { isAuthenticated } from "../../services/auth";
import "./ProductCard.css";

const ProductCard = ({
    id,
    img,
    name,
    price,
    promoPrice,
    rating = 5,
    reviews = 0
}) => {
    const navigate = useNavigate();
    const { adicionarProduto } = useContext(CarrinhoContext);

    const handleComprar = async () => {
        const auth = await isAuthenticated();
        if (auth) {
            const imgPath = '/' + img.split("/").slice(3, 6).join("/");
            console.log(imgPath)
            adicionarProduto({ Id: id, Imagem: imgPath, Nome: name, Preco: promoPrice ?? price });
            navigate("/carrinho");
        } else {
            navigate("/login");
        }
    };

    const discount = promoPrice
        ? Math.round(((price - promoPrice) / price) * 100)
        : null;

    return (
        <div className="pc-card">

            {/* Badge de desconto */}
            {discount && (
                <div className="pc-promo-badge">-{discount}%</div>
            )}

            {/* Imagem */}
            <div className="pc-img-wrapper" onClick={() => navigate(`/produtos/${id}`)}>
                <img src={img} alt={name} />
            </div>

            {/* Body */}
            <div className="pc-body">

                {/* Rating */}
                <div className="pc-rating">
                    <div className="pc-stars">
                        {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} className={`pc-star${i > rating ? " empty" : ""}`}>
                                star
                            </span>
                        ))}
                    </div>
                    <span className="pc-reviews">({reviews})</span>
                </div>

                {/* Nome */}
                <p className="pc-name">{name}</p>

                {/* Frete */}
                <div className="pc-frete">
                    <span className="msymbol">local_shipping</span>
                    Frete grátis
                </div>

                {/* Preço */}
                <div className="pc-price-wrap">
                    {promoPrice && (
                        <div className="pc-price-original">R$ {Number(price).toFixed(2)}</div>
                    )}
                    <div className="pc-price">
                        <span>R$ </span>{Number(promoPrice ?? price).toFixed(2)}
                    </div>
                </div>
                <div className="pc-installments">à vista no PIX ou até 10x</div>

                {/* Botões */}
                <div className="pc-actions">
                    <button className="pc-btn-buy" onClick={handleComprar}>
                        <span className="msymbol">shopping_cart</span>
                        Comprar
                    </button>
                    <button className="pc-btn-details" onClick={() => navigate(`/produtos/${id}`)}>
                        <span className="msymbol">open_in_new</span>
                        Ver detalhes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductCard;