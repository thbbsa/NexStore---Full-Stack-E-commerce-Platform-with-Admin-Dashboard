import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home/Home.jsx'
import Login from './pages/Autentificação/Login.jsx'
import Register from './pages/Autentificação/Registes.jsx'
import DashBoard from './pages/DashBoard/DashBoard.jsx'

// componentes internos do dashboard
import DashboardHome from './componentes/DashBoard/DashboardHome.jsx'
import ListaProdutos from './componentes/DashBoard/Produtos/ListaProdutos.jsx'
import CriarProduto from './componentes/DashBoard/Produtos/CriarProduto.jsx'
import EditarProduto from './componentes/DashBoard/Produtos/EditarProduto.jsx'
import ListaUsuarios from './componentes/DashBoard/Usuarios/ListaUsuarios.jsx'
import EditarUsuario from './componentes/DashBoard/Usuarios/EditarUsuario.jsx'
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx';
import BuscarProduto from './pages/BuscarProduto/BuscarProduto.jsx';
import Carrinho from './pages/Carrinho/Carrinho.jsx'
import CheckoutIdentificacao from './pages/Checkout/Checkoutidentificacao.jsx';
import Perfil from './pages/Perfil/PerfilDetails.jsx'

import { CarrinhoProvider } from "./context/Carrinho/CarrinhoProvider.jsx";

import ProtectedRoute from "./componentes/ProtectedRoute/ProtectedRoute.jsx";

import "./css/index.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <CarrinhoProvider>
      <Router>
        <Routes>

          {/* públicas */}
          <Route path="/produtos/:id" element={<ProductDetails />} />
          <Route path="/produtos" element={<BuscarProduto />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/identificacao" element={<CheckoutIdentificacao />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Home />} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />


          {/* DASHBOARD */}
          <Route path="/dashboard" element={<DashBoard />}> 
            <Route index element={<DashboardHome />} />

            {/* produtos */}
            <Route path="produtos" element={<ListaProdutos />} />
            <Route path="produtos/novo" element={<CriarProduto />} />
            <Route path="produtos/editar/:id" element={<EditarProduto />} />

            {/* usuários */}
            <Route path="usuarios" element={<ListaUsuarios />} />
            <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
          </Route>

        </Routes>
      </Router>
    </CarrinhoProvider>

  </StrictMode>
);
