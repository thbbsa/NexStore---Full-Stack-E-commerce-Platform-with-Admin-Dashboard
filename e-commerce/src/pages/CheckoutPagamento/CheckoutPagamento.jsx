import "./CheckoutPagamento.css";
import { Tab } from "bootstrap";
import { formatarCartao, formartarValidadeCartao } from "../../utils/formatters"
import { useNavigate } from "react-router-dom"

import { useCheckoutPagamento } from "./hook/useCheckoutPagamento";


const STEPS = ["Carrinho", "Identificação", "Pagamento", "Concluído"];

const TABS = [
    { id: "cartao", label: "Cartão De Crédito", icon: "credit_card" },
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
    const navigate = useNavigate();

    const {
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
    } = useCheckoutPagamento(TABS)

    return (
        <div className="ck-page">
            <div className="ck-message-error-wrap">
                <div className={`ck-error-message ${messageError ? "show" : ""}`}>
                    <MSIcon name="error" size={16} fill={1} />
                    <span>{messageError || "Erro"}</span>
                </div>
            </div>

            <div className="ck-message-success-wrap">
                <div className={`ck-success-message ${messageSuccess ? "show" : ""}`}>
                    <MSIcon name="check" size={16} fill={1} />
                    <span>{messageSuccess || "Sucesso"}</span>
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
                                                    value={formartarValidadeCartao(dadosCartao.validade)}
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
                                            <select className="ck-form-input ck-select" style={{ cursor: 'pointer' }} value={dadosCartao.parcelas} onChange={(e) => setDadosCartao({ ...dadosCartao, parcelas: e.target.value })}>
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
                            <span style={{ color: freteValor === 0 ? '#00e596' : 'var(--text)' }}>
                                {freteValor === 0 ? "Grátis" : `R$ ${freteValor.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="ck-summary-divider" />
                        <div className="ck-summary-row total">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="ck-summary-footer">
                        <button
                            className="ck-btn-next"
                            onClick={verificarInformacoes}
                            disabled={loading}
                        >
                            <MSIcon name="check_circle" size={18} wght={500} />
                            {loading ? "Processando..." : "Confirmar Pagamento"}
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