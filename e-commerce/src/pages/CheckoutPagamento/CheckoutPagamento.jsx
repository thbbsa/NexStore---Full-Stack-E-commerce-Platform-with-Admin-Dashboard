import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarrinhoContext } from "../../context/Carrinho/CarrinhoContext";
import "./CheckoutPagamento.css";
import { getMe, getEndereco, storePedido } from "../../services/userService";
import { useEffect } from "react";

const STEPS = ["Carrinho", "Identificação", "Pagamento", "Concluído"];

const TABS = [
    { id: "cartao", label: "Cartão", icon: "credit_card" },
    { id: "pix", label: "PIX", icon: "pix" },
    { id: "boleto", label: "Boleto", icon: "receipt_long" },
];

const MSIcon = ({ name, size = 17, fill = 0, wght = 400 }) => (
    <span
        className="ms"
        style={{
            fontSize: size,
            fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' 0, 'opsz' 20`,
        }}
    >
        {name}
    </span>
);

export default function CheckoutPagamento() {
    const controller = new AbortController();
    const [metodo, setMetodo] = useState("cartao");
    const [messageError, setMessageError] = useState("");
    const [dadosCartao, setDadosCartao] = useState({
        numeroCartao: "",
        nomeCartao: "",
        validade: "",
        cvv: "",
        parcelas: "1",
    })
    const navigate = useNavigate();
    const { carrinho, calcularTotal } = useContext(CarrinhoContext);

    const total = calcularTotal();

    async function verificarInformacoes() {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
            navigate("/carrinho");
            return;
        }

        if (metodo === "cartao") {
            if (!dadosCartao.numeroCartao || !dadosCartao.nomeCartao || !dadosCartao.validade || !dadosCartao.cvv) {
                mostrarMensagemErro("Por favor, preencha todas as informações do cartão.");
                return;
            } else if (!/^\d{16}$/.test(dadosCartao.numeroCartao.replace(/\s/g, ''))) {
                mostrarMensagemErro("Número do cartão inválido. Deve conter 16 dígitos.");
                return;
            } else if (!/^\d{2}\/\d{2}$/.test(dadosCartao.validade)) {
                mostrarMensagemErro("Data de validade inválida. Use o formato MM/AA.");
                return;
            } else if (!/^\d{3,4}$/.test(dadosCartao.cvv)) {
                mostrarMensagemErro("CVV inválido. Deve conter 3 ou 4 dígitos.");
                return;
            } else if (dadosCartao.parcelas === "0") {
                mostrarMensagemErro("Selecione o número de parcelas.");
                return;
            } else {
                // navigate("/checkout/concluido");
                await armazenarDados();
            }
        }
    }

    function mostrarMensagemErro(msg) {
        setMessageError(msg);

        setTimeout(() => {
            setMessageError("");
        }, 5000);
    }

    function formatarCartao(numero) {
        const apenasNumeros = numero.replace(/\D/g, '');
        const partes = [];
        for (let i = 0; i < apenasNumeros.length; i += 4) {
            partes.push(apenasNumeros.substring(i, i + 4));
        }

        return partes.join(' ');
    }

    function formatarValidade(valor) {
        const apenasNumeros = valor.replace(/\D/g, '');
        let formatted = apenasNumeros;
        if (apenasNumeros.length > 2) {
            formatted = apenasNumeros.substring(0, 2) + '/' + apenasNumeros.substring(2, 4);
        }
        return formatted;
    }

    async function armazenarDados() {
        const userData = await getMe();
        const enderecoData = await getEndereco({ signal: controller.signal });
        const endereco = await enderecoData.json();
        const enderecoPrincipal = endereco.find(e => e.Principal)?.Id_endereco ?? null

        const payload = {
            userId: userData.user.Id,
            enderecoId: enderecoPrincipal,
            total: total,

            itens: carrinho.map(p => {
                return {
                    produtoId: p.Id,
                    quantidade: p.quantidade,
                }
            })
        }

        try {
            const pedido = await storePedido(payload);
            console.log("Pedido criado:", pedido);
            // navigate("/checkout/concluido");
        } catch (err) {
            console.error("Erro ao criar pedido:", err);
        }
    }
    return (
        <div className="ck-page">
            <div className="ck-message-error-wrap">
                <div className={`ck-error-message ${messageError ? "show" : ""}`}>
                    <MSIcon name="error" size={16} fill={1} />
                    <span>{messageError || "Erro"}</span>
                </div>
            </div>

            <div className="ck-wrap">

                {/* Stepper */}
                <div className="ck-stepper">
                    {STEPS.map((s, i) => (
                        <div key={i} className={`ck-step${i === 2 ? " active" : i < 2 ? " done" : ""}`}>
                            <div className="ck-step-num">
                                {i < 2
                                    ? <MSIcon name="check" size={14} fill={1} />
                                    : i + 1}
                            </div>
                            <span className="ck-step-label">{s}</span>
                        </div>
                    ))}
                </div>

                {/* Coluna esquerda */}
                <div className="ck-left">
                    <div className="ck-card">
                        <div className="ck-card-head">
                            <div className="ck-card-head-icon">
                                <MSIcon name="payments" size={17} />
                            </div>
                            <div>
                                <h3>Forma de pagamento</h3>
                                <p>Escolha como deseja pagar o seu pedido</p>
                            </div>
                        </div>

                        <div className="ck-card-body">

                            {/* Tabs */}
                            <div className="ck-pay-tabs">
                                {TABS.map(t => (
                                    <button
                                        key={t.id}
                                        className={`ck-pay-tab${metodo === t.id ? " active" : ""}`}
                                        onClick={() => setMetodo(t.id)}
                                    >
                                        <MSIcon name={t.icon} size={17} fill={metodo === t.id ? 1 : 0} />
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Cartão */}
                            {metodo === "cartao" && (
                                <div className="ck-card-form">

                                    <div className="ck-form-field full">
                                        <label>Número do cartão</label>
                                        <div className="ck-form-input-wrap">
                                            <MSIcon name="credit_card" size={15} />
                                            <input
                                                className="ck-form-input"
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                value={formatarCartao(dadosCartao.numeroCartao)}
                                                onChange={(e) => setDadosCartao({ ...dadosCartao, numeroCartao: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="ck-form-field full">
                                        <label>Nome no cartão</label>
                                        <div className="ck-form-input-wrap">
                                            <MSIcon name="badge" size={15} />
                                            <input
                                                className="ck-form-input"
                                                placeholder="NOME SOBRENOME"
                                                value={dadosCartao.nomeCartao}
                                                onChange={(e) => setDadosCartao({ ...dadosCartao, nomeCartao: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="ck-card-form-row">
                                        <div className="ck-form-field">
                                            <label>Validade</label>
                                            <div className="ck-form-input-wrap">
                                                <MSIcon name="calendar_month" size={15} />
                                                <input
                                                    className="ck-form-input"
                                                    placeholder="MM/AA"
                                                    maxLength={5}
                                                    value={formatarValidade(dadosCartao.validade)}
                                                    onChange={(e) => setDadosCartao({ ...dadosCartao, validade: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="ck-form-field">
                                            <label>CVV</label>
                                            <div className="ck-form-input-wrap">
                                                <MSIcon name="lock" size={15} />
                                                <input
                                                    className="ck-form-input"
                                                    placeholder="•••"
                                                    maxLength={4}
                                                    type="password"
                                                    value={dadosCartao.cvv}
                                                    onChange={(e) => setDadosCartao({ ...dadosCartao, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ck-form-field full">
                                        <label>Parcelas</label>
                                        <div className="ck-form-input-wrap">
                                            <MSIcon name="receipt" size={15} />
                                            <select className="ck-form-input" style={{ cursor: 'pointer' }} value={dadosCartao.parcelas} onChange={(e) => setDadosCartao({ ...dadosCartao, parcelas: e.target.value })}>
                                                <option>1x de R$ {total.toFixed(2)} sem juros</option>
                                                <option>2x de R$ {(total / 2).toFixed(2)} sem juros</option>
                                                <option>3x de R$ {(total / 3).toFixed(2)} sem juros</option>
                                                <option>6x de R$ {(total / 6).toFixed(2)} sem juros</option>
                                                <option>10x de R$ {(total / 10).toFixed(2)} sem juros</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* PIX */}
                            {metodo === "pix" && (
                                <div className="ck-pix-block">
                                    <div className="ck-pix-icon-wrap">
                                        <MSIcon name="qr_code_2" size={36} />
                                    </div>
                                    <div className="ck-pix-title">Pague com PIX</div>
                                    <p className="ck-pix-desc">
                                        Ao confirmar, geraremos um QR Code para você pagar pelo app do seu banco.
                                        O pagamento é confirmado em <strong style={{ color: 'var(--text)' }}>segundos</strong>.
                                    </p>
                                    <div className="ck-pix-badge">
                                        <MSIcon name="bolt" size={14} fill={1} />
                                        Confirmação instantânea
                                    </div>
                                </div>
                            )}

                            {/* Boleto */}
                            {metodo === "boleto" && (
                                <div className="ck-boleto-block">
                                    <div className="ck-boleto-info">
                                        <MSIcon name="receipt_long" size={20} />
                                        <p>
                                            O boleto será gerado após a confirmação do pedido.
                                            O prazo de pagamento é de <strong>3 dias úteis</strong>.
                                            Após o pagamento, a confirmação pode levar até <strong>2 dias úteis</strong>.
                                        </p>
                                    </div>
                                    <div className="ck-boleto-info">
                                        <MSIcon name="info" size={20} />
                                        <p>
                                            O pedido só será processado após a confirmação do pagamento pelo banco.
                                            O boleto vencido <strong>não pode ser reaproveitado</strong>.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Resumo */}
                <div className="ck-summary">
                    <div className="ck-summary-head">Resumo do pedido</div>
                    <div className="ck-summary-body">

                        {carrinho.map((produto, i) => {
                            const preco = produto.PrecoPromocional ?? produto.Preco ?? produto.price ?? 0;
                            return (
                                <div className="ck-summary-item" key={i}>
                                    <div className="ck-summary-img">
                                        {produto.Imagem
                                            ? <img src={`http://localhost:3000${produto.Imagem}`} alt={produto.Nome} />
                                            : "📦"}
                                    </div>
                                    <div className="ck-summary-item-info">
                                        <div className="ck-summary-item-name">{produto.Nome}</div>
                                        <div className="ck-summary-item-qty">Qtd: {produto.quantidade}</div>
                                    </div>
                                    <div className="ck-summary-item-price">
                                        R$ {(preco * produto.quantidade).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="ck-summary-divider" />
                        <div className="ck-summary-row">
                            <span>Subtotal</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                        <div className="ck-summary-row">
                            <span>Frete</span>
                            <span style={{ color: '#00e596' }}>Grátis</span>
                        </div>
                        <div className="ck-summary-divider" />
                        <div className="ck-summary-row total">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="ck-summary-footer">
                        <button className="ck-btn-next" onClick={() => verificarInformacoes()}>
                            <MSIcon name="check_circle" size={18} wght={500} />
                            Confirmar Pagamento
                        </button>
                        <button className="ck-btn-back" onClick={() => navigate("/checkout/identificacao")}>
                            <MSIcon name="arrow_back" size={15} />
                            Voltar à identificação
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}