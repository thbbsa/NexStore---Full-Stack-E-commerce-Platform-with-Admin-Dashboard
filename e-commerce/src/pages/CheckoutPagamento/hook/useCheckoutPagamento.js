import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validadeCartaoValida } from "../../../utils/checkValidity";
import { getMe, storePedido } from "../../../services/userService";
import { CheckoutContext } from "../../../context/CheckoutContext/CheckoutContext";
import { CarrinhoContext } from "../../../context/Carrinho/CarrinhoContext";

const ESTADO_INICIAL_CARTAO = {
    numeroCartao: "",
    nomeCartao: "",
    validade: "",
    cvv: "",
    parcelas: "1",
};

export function useCheckoutPagamento(TABS) {
    const [metodo, setMetodo] = useState("cartao");
    const [dadosCartao, setDadosCartao] = useState(ESTADO_INICIAL_CARTAO);
    const [messageError, setMessageError] = useState("");
    const [messageSuccess, setMessageSuccess] = useState("");

    const navigate = useNavigate();
    const { carrinho, calcularTotal, limparCarrinho } = useContext(CarrinhoContext);
    const { dadosCheckout, limparCheckout } = useContext(CheckoutContext);

    const freteValor = dadosCheckout.tipoEntrega?.preco === "Grátis" ? 0 : 19.90;
    const total = calcularTotal() + freteValor;

    const [loading, setLoading] = useState(false)

    function mostrarMensagem(tipo, msg) {
        if (tipo === "erro") {
            setMessageError(msg);
            setTimeout(() => setMessageError(""), 3000);
        } else {
            setMessageSuccess(msg);
            setTimeout(() => setMessageSuccess(""), 3000);
        }
    }

    function validarCartao() {
        const { numeroCartao, nomeCartao, validade, cvv, parcelas } = dadosCartao;

        if (!numeroCartao || !nomeCartao || !validade || !cvv) {
            mostrarMensagem("erro", "Por favor, preencha todas as informações do cartão.");
            return false;
        }
        if (!/^\d{16}$/.test(numeroCartao.replace(/\s/g, ""))) {
            mostrarMensagem("erro", "Número do cartão inválido. Deve conter 16 dígitos.");
            return false;
        }
        if (!validadeCartaoValida(validade)) {
            mostrarMensagem("erro", "Data de validade inválida ou cartão vencido.");
            return false;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            mostrarMensagem("erro", "CVV inválido. Deve conter 3 ou 4 dígitos.");
            return false;
        }
        if (parcelas === "0") {
            mostrarMensagem("erro", "Selecione o número de parcelas.");
            return false;
        }

        return true;
    }

    async function verificarInformacoes() {
        if (carrinho.length === 0) {
            mostrarMensagem("erro", "Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
            await new Promise(resolve => setTimeout(resolve, 3000));
            navigate("/carrinho");
            return;
        }

        if (metodo === "cartao" && !validarCartao()) return;

        await armazenarDados();
    }

    async function armazenarDados() {
        setLoading(true)
        try {
            const userData = await getMe();

            const payload = {
                userId: userData.user.Id,
                enderecoId: dadosCheckout.enderecoId,
                total,
                pagamento: {
                    metodo: TABS.find(t => t.id === metodo)?.label,
                    valor: total,
                },
                itens: carrinho.map(({ Id, quantidade }) => ({
                    produtoId: Id,
                    quantidade,
                })),
            };

            const pedido = await storePedido(payload);
            mostrarMensagem("sucesso", "Pedido criado com sucesso!");

            await new Promise(resolve => setTimeout(resolve, 3000));

            limparCarrinho();
            limparCheckout();
            navigate(`/checkout/concluido/${pedido.pedidoId}`);
        } catch (err) {
            console.error("Erro ao criar pedido:", err);
            mostrarMensagem("erro", "Erro ao criar pedido. Tente novamente.");
        } finally {
            setLoading(false)
        }
    }

    return {
        carrinho,
        metodo,
        setMetodo,
        dadosCartao,
        setDadosCartao,
        total,
        freteValor,
        messageSuccess,
        messageError,
        verificarInformacoes,
        loading
    }
}