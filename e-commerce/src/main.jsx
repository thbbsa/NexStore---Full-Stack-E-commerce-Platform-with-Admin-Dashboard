import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas Principais e Públicas
import Home from './pages/Home/Home.jsx';
import Login from './pages/Autentificação/Login.jsx';
import Register from './pages/Autentificação/Registes.jsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx';
import BuscarProduto from './pages/BuscarProduto/BuscarProduto.jsx';
import Carrinho from './pages/Carrinho/Carrinho.jsx';

// Fluxo de Checkout e Pedidos
import CheckoutIdentificacao from './pages/Checkout/Checkoutidentificacao.jsx';
import CheckoutPagamento from './pages/CheckoutPagamento/CheckoutPagamento.jsx';
import CheckoutConcluido from './pages/CheckoutConcluido/CheckoutConcluido.jsx';
import Perfil from './pages/Perfil/PerfilDetails.jsx';
import DetalhePedido from './pages/DetalhePedido/DetalhePedido.jsx';
import PedidoUsuarios from './pages/PedidosUsuarios/PedidosUsuarios.jsx';

// Painel do Dashboard (Layout + Sub-rotas)
import DashBoard from './pages/DashBoard/DashBoard.jsx';
import DashboardHome from './componentes/DashBoard/DashBoardHome/DashboardHome.jsx';
import ListaProdutos from './componentes/DashBoard/Produtos/ListaProdutos.jsx';
import CriarProduto from './componentes/DashBoard/Produtos/CriarProduto.jsx';
import EditarProduto from './componentes/DashBoard/Produtos/EditarProduto.jsx';
import ListaUsuarios from './componentes/DashBoard/Usuarios/ListaUsuarios.jsx';
import EditarUsuario from './componentes/DashBoard/Usuarios/EditarUsuario.jsx';
import AdicionarUsuario from './componentes/DashBoard/Usuarios/AdicionarUsuario.jsx';
import Pedido from './componentes/DashBoard/Pedido/Pedidos.jsx';

// Contextos e Autenticação
import { CarrinhoProvider } from "./context/Carrinho/CarrinhoProvider.jsx";
import { CheckoutProvider } from './context/CheckoutContext/CheckoutContext.jsx';
import ProtectedRoute from "./componentes/ProtectedRoute/ProtectedRoute.jsx";

// Estilos Globais
import "./css/index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarrinhoProvider>
      <CheckoutProvider>
        <Router>
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Produtos e Busca */}
            <Route path="/produtos" element={<BuscarProduto />} />
            <Route path="/produtos/:id" element={<ProductDetails />} />
            
            {/* Carrinho e Checkout */}
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/checkout/identificacao" element={<CheckoutIdentificacao />} />
            <Route path="/checkout/pagamento" element={<CheckoutPagamento />} />
            <Route path="/checkout/concluido/:pedidoId" element={<CheckoutConcluido />} />
            
            {/* Pedidos do Cliente */}
            <Route path="/detalhe-pedido/:pedidoId" element={<DetalhePedido />} />
            <Route path="/meus-pedidos" element={<PedidoUsuarios />} />

            {/* --- ROTAS PROTEGIDAS DO CLIENTE --- */}
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

            {/* --- DASHBOARD ADMINISTRATIVO (PROTEGIDO) --- */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />

              {/* Módulo de Produtos */}
              <Route path="produtos" element={<ListaProdutos />} />
              <Route path="produtos/novo" element={<CriarProduto />} />
              <Route path="produtos/editar/:id" element={<EditarProduto />} />

              {/* Módulo de Usuários */}
              <Route path="usuarios" element={<ListaUsuarios />} />
              <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
              <Route path="usuarios/criar-novo" element={<AdicionarUsuario />} />

              {/* Módulo de Pedidos */}
              <Route path="pedidos" element={<Pedido />} />
            </Route>

            {/* Rota Fallback para 404 (Sempre por último) */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </CheckoutProvider>
    </CarrinhoProvider>
  </StrictMode>
);