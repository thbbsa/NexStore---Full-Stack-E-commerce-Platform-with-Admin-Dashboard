import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, getEndereco, storeEndereco, UpdateEndereco } from "../../services/userService";
import { CarrinhoContext } from "../../context/Carrinho/CarrinhoContext";
import "./CheckoutIdentificacao.css";

// ─── Constantes ────────────────────────────────────────────────────────────────

const STEPS = ["Carrinho", "Identificação", "Pagamento", "Concluído"];

const ENTREGAS = [
  { id: "normal",   label: "Entrega Normal",   prazo: "5 a 8 dias úteis", preco: "Grátis",   icon: "local_shipping" },
  { id: "expressa", label: "Entrega Expressa", prazo: "1 a 2 dias úteis", preco: "R$ 19,90", icon: "bolt"           },
];

const CAMPOS_ENDERECO = [
  { label: "CEP",         name: "cep",         icon: "pin_drop",        placeholder: "00000-000",    cls: ""     },
  { label: "Rua",         name: "logradouro",  icon: "route",           placeholder: "Nome da rua",  cls: "span2"},
  { label: "Número",      name: "numero",      icon: "tag",             placeholder: "123",          cls: ""     },
  { label: "Complemento", name: "complemento", icon: "apartment",       placeholder: "Apto, bloco...",cls: ""    },
  { label: "Bairro",      name: "bairro",      icon: "holiday_village", placeholder: "Seu bairro",   cls: ""     },
  { label: "Cidade",      name: "localidade",  icon: "location_city",   placeholder: "São Paulo",    cls: ""     },
  { label: "Estado",      name: "estado",      icon: "map",             placeholder: "SP",           cls: ""     },
];

const ENDERECO_VAZIO = {
  cep: "", logradouro: "", numero: "",
  complemento: "", bairro: "", localidade: "", estado: "",
};

const USER_VAZIO = {
  Id: "", Nome: "", Username: "", Email: "", Telefone: "", CPF: "", Enderecos: [],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function normalizarEndereco(e) {
  return {
    id:          e.Id_endereco,
    label:       "Casa",
    rua:         e.Rua,
    numero:      e.Numero,
    complemento: e.Complemento,
    bairro:      e.Bairro,
    cidade:      e.Cidade,
    estado:      e.Estado,
    cep:         e.Cep,
    principal:   e.Principal,
  };
}

function desnormalizarEndereco(e) {
  return {
    Id_endereco: e.id,
    Rua:         e.rua,
    Numero:      e.numero,
    Complemento: e.complemento,
    Bairro:      e.bairro,
    Cidade:      e.cidade,
    Estado:      e.estado,
    Cep:         e.cep,
    Principal:   true,
  };
}

// ─── Subcomponentes ────────────────────────────────────────────────────────────

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

// ─── Componente principal ──────────────────────────────────────────────────────

export default function CheckoutIdentificacao() {
  const [user, setUser]                       = useState(USER_VAZIO);
  const [endereco, setEndereco]               = useState(ENDERECO_VAZIO);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [adicionandoNovo, setAdicionandoNovo] = useState(false);
  const [entrega, setEntrega]                 = useState("normal");

  const navigate = useNavigate();
  const { carrinho, calcularTotal } = useContext(CarrinhoContext);

  // ── Busca dados do usuário e endereços ──────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController();

    async function buscarDadosUsuario() {
      try {
        const data     = await getMe();
        const response = await getEndereco({ signal: controller.signal });
        const enderecos = await response.json();

        const lista = Array.isArray(enderecos)
          ? enderecos.map(normalizarEndereco)
          : [normalizarEndereco(enderecos)];

        if (data?.user) {
          setUser(prev => ({ ...prev, ...data.user, Enderecos: lista }));

          const principal = lista.find(e => e.principal);
          setEnderecoSelecionado(lista.length > 0 ? (principal?.id ?? lista[0].id) : null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    }

    buscarDadosUsuario();
    return () => controller.abort();
  }, []);

  // ── Autocomplete de CEP ─────────────────────────────────────────────────────

  async function completarEnderecoPorCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) return;

    setEndereco(prev => ({
      ...prev,
      logradouro: data.logradouro,
      bairro:     data.bairro,
      localidade: data.localidade,
      estado:     data.uf,
    }));
  }

  function handleChange(campo, valor) {
    if (campo === "cep") {
      const cepLimpo = valor.replace(/\D/g, "");
      if (cepLimpo.length === 8) completarEnderecoPorCep(cepLimpo);
    }

    setEndereco(prev => ({ ...prev, [campo]: valor }));
  }

  // ── Ações ───────────────────────────────────────────────────────────────────

  async function salvarEndereco() {
    await storeEndereco(endereco);
    setEndereco(ENDERECO_VAZIO);
    setAdicionandoNovo(false);
  }

  function definirPrincipal(id) {
    const endereco = user.Enderecos.find(e => e.id === id);
    if (!endereco) return;
    UpdateEndereco(desnormalizarEndereco(endereco));
  }

  function irParaPagamento() {
    definirPrincipal(enderecoSelecionado);
    navigate("/checkout/pagamento");
  }

  // ── Cálculos ────────────────────────────────────────────────────────────────

  const freteValor = entrega === "expressa" ? 19.90 : 0;
  const total      = calcularTotal() + freteValor;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="ck-page">
      <div className="ck-wrap">

        <Stepper stepAtual={1} />

        <div className="ck-left">
          <CardDadosUsuario user={user} />
          <CardEndereco
            enderecos={user.Enderecos}
            enderecoSelecionado={enderecoSelecionado}
            adicionandoNovo={adicionandoNovo}
            endereco={endereco}
            onSelecionarEndereco={(id) => { setEnderecoSelecionado(id); setAdicionandoNovo(false); }}
            onToggleNovo={() => setAdicionandoNovo(v => !v)}
            onChangeEndereco={handleChange}
            onSalvarEndereco={salvarEndereco}
          />
          <CardEntrega entrega={entrega} onSelecionar={setEntrega} />
        </div>

        <Resumo
          carrinho={carrinho}
          subtotal={calcularTotal()}
          freteValor={freteValor}
          total={total}
          onProsseguir={irParaPagamento}
          onVoltar={() => navigate("/carrinho")}
        />

      </div>
    </div>
  );
}

// ─── Cards / seções ────────────────────────────────────────────────────────────

function Stepper({ stepAtual }) {
  return (
    <div className="ck-stepper">
      {STEPS.map((s, i) => (
        <div key={i} className={`ck-step${i === stepAtual ? " active" : i < stepAtual ? " done" : ""}`}>
          <div className="ck-step-num">
            {i < stepAtual
              ? <MSIcon name="check" size={14} fill={1} />
              : i + 1}
          </div>
          <span className="ck-step-label">{s}</span>
        </div>
      ))}
    </div>
  );
}

function CardDadosUsuario({ user }) {
  const campos = [
    { label: "Nome",     icon: "badge", value: user.Nome     },
    { label: "Email",    icon: "mail",  value: user.Email    },
    { label: "Telefone", icon: "call",  value: user.Telefone },
    { label: "CPF",      icon: "lock",  value: user.CPF || "***.***.***-**", locked: true },
  ];

  return (
    <div className="ck-card" style={{ animationDelay: "0s" }}>
      <div className="ck-card-head">
        <div className="ck-card-head-icon"><MSIcon name="person" size={17} /></div>
        <div>
          <h3>Confirmação de dados</h3>
          <p>Seus dados cadastrais para esta compra</p>
        </div>
      </div>
      <div className="ck-card-body">
        <div className="ck-user-grid">
          {campos.map(f => (
            <div className="ck-user-field" key={f.label}>
              <label>
                <MSIcon name={f.icon} size={11} fill={1} />
                {f.label}
              </label>
              <div className={`ck-user-value${f.locked ? " locked" : ""}`}>
                {f.value || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardEndereco({ enderecos, enderecoSelecionado, adicionandoNovo, endereco, onSelecionarEndereco, onToggleNovo, onChangeEndereco, onSalvarEndereco }) {
  return (
    <div className="ck-card" style={{ animationDelay: "0.07s" }}>
      <div className="ck-card-head">
        <div className="ck-card-head-icon"><MSIcon name="location_on" size={17} /></div>
        <div>
          <h3>Endereço de entrega</h3>
          <p>Selecione ou cadastre um endereço</p>
        </div>
      </div>
      <div className="ck-card-body">

        <div className="ck-addr-list">
          {enderecos?.map(e => (
            <div
              key={e.id}
              className={`ck-addr-card${enderecoSelecionado === e.id ? " selected" : ""}`}
              onClick={() => onSelecionarEndereco(e.id)}
            >
              <div className="ck-addr-radio"><div className="ck-addr-radio-dot" /></div>
              <div className="ck-addr-info">
                <div className="ck-addr-label-row">
                  <span className="ck-addr-tag">{e.label}</span>
                </div>
                <div className="ck-addr-main">
                  {e.rua}, {e.numero}{e.complemento ? ` — ${e.complemento}` : ""}
                </div>
                <div className="ck-addr-sub">
                  {e.bairro} · {e.cidade}/{e.estado} · {e.cep}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="ck-addr-new" onClick={onToggleNovo}>
          <MSIcon name={adicionandoNovo ? "remove_circle" : "add_circle"} size={18} />
          {adicionandoNovo ? "Cancelar" : "Adicionar novo endereço"}
        </button>

        {adicionandoNovo && (
          <FormNovoEndereco
            endereco={endereco}
            onChange={onChangeEndereco}
            onSalvar={onSalvarEndereco}
          />
        )}

      </div>
    </div>
  );
}

function FormNovoEndereco({ endereco, onChange, onSalvar }) {
  return (
    <div className="ck-new-form">
      {CAMPOS_ENDERECO.map(f => (
        <div key={f.label} className={`ck-form-field${f.cls ? " " + f.cls : ""}`}>
          <label>{f.label}</label>
          <div className="ck-form-input-wrap">
            <span
              className="ms"
              style={{
                fontSize: 15, paddingLeft: 10, color: "var(--muted)",
                fontVariationSettings: "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20",
                fontWeight: "normal", lineHeight: 1,
              }}
            >
              {f.icon}
            </span>
            <input
              className="ck-form-input"
              placeholder={f.placeholder}
              value={endereco[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          </div>
        </div>
      ))}
      <div className="span2" style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <button className="ck-form-save-btn" onClick={onSalvar}>
          Salvar endereço
        </button>
      </div>
    </div>
  );
}

function CardEntrega({ entrega, onSelecionar }) {
  return (
    <div className="ck-card" style={{ animationDelay: "0.14s" }}>
      <div className="ck-card-head">
        <div className="ck-card-head-icon"><MSIcon name="local_shipping" size={17} /></div>
        <div>
          <h3>Tipo de entrega</h3>
          <p>Escolha como quer receber seu pedido</p>
        </div>
      </div>
      <div className="ck-card-body">
        <div className="ck-delivery-list">
          {ENTREGAS.map(e => (
            <div
              key={e.id}
              className={`ck-delivery-opt${entrega === e.id ? " selected" : ""}`}
              onClick={() => onSelecionar(e.id)}
            >
              <div className="ck-delivery-icon"><MSIcon name={e.icon} size={18} /></div>
              <div className="ck-delivery-info">
                <div className="ck-delivery-name">{e.label}</div>
                <div className="ck-delivery-prazo">{e.prazo}</div>
              </div>
              <div className={`ck-delivery-price${e.preco === "Grátis" ? " free" : ""}`}>
                {e.preco}
              </div>
              <div className="ck-delivery-radio"><div className="ck-delivery-radio-dot" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Resumo({ carrinho, subtotal, freteValor, total, onProsseguir, onVoltar }) {
  return (
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
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="ck-summary-row">
          <span>Frete</span>
          <span style={{ color: freteValor === 0 ? "#00e596" : "var(--text)" }}>
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
        <button className="ck-btn-next" onClick={onProsseguir}>
          <MSIcon name="payments" size={18} wght={500} />
          Ir para Pagamento
        </button>
        <button className="ck-btn-back" onClick={onVoltar}>
          <MSIcon name="arrow_back" size={15} />
          Voltar ao carrinho
        </button>
      </div>
    </div>
  );
}