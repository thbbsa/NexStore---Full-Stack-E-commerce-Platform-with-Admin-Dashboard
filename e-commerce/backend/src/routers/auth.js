const express = require("express");
const authMiddleware = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const {
  register,
  criarUsuario,
  login,
  logout,
  getMe,
  getUserById,
  updateUser,
  excluirUsuario,
  createEndereco,
  getEndereco,
  getEnderecosByUserId,
  updateEndereco,
  deletarEndereco,
  getUsuarios
} = require("../controllers/userController");

const {
  criarProduto,
  listarProdutosAdmin,
  controller,
  desativarProduto,
  buscarProduto,
  atualizarProduto,
} = require("../controllers/produtoController");

const { criarPedido, getPedido, getPedidos, getPedidosStats, getPedidosInfo } = require("../controllers/PedidoController");

const { Pedido } = require("../models/Pedido");

const upload = require("../middleware/upload");

const { avancarStatusPedido } = require("../controllers/avancarStatusPedido");


const router = express.Router();

// ---------- Públicas ----------
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/produtos", controller);

// ---------- Produtos (rotas fixas antes de /:id) ----------
router.get("/produtos/admin", authMiddleware, requireAdmin, listarProdutosAdmin);
router.get("/produtos/:id", buscarProduto);
router.post("/produtos", authMiddleware, requireAdmin, upload.single("imagem"), criarProduto);
router.patch("/produtos/:id", authMiddleware, requireAdmin, atualizarProduto);
router.patch("/produtos/:id/desativar", authMiddleware, requireAdmin, desativarProduto);

// ---------- Usuário ----------
router.get("/perfil", authMiddleware, getMe);
router.patch("/perfil/:id", authMiddleware, updateUser);
router.get("/user/:id", authMiddleware, requireAdmin, getUserById);
router.get("/usuarios", authMiddleware, requireAdmin, getUsuarios);
router.post("/usuarios", authMiddleware, requireAdmin, criarUsuario);
router.delete("/:id", authMiddleware, requireAdmin, excluirUsuario);

// ---------- Endereço ----------
router.post("/criar-endereco", authMiddleware, createEndereco);
router.post("/:id/criar-endereco", authMiddleware, requireAdmin, createEndereco);
router.get("/meu-endereco", authMiddleware, getEndereco);
router.get("/enderecos/:id", authMiddleware, requireAdmin, getEnderecosByUserId);
router.patch("/atualizar-endereco/:id", authMiddleware, updateEndereco);
router.delete("/endereco/:id", authMiddleware, deletarEndereco);

// ---------- Pedidos ----------
router.get("/pedidos-info", authMiddleware, requireAdmin, getPedidosInfo);
router.get("/stats", authMiddleware, requireAdmin, getPedidosStats);
router.post("/criar-pedido", authMiddleware, criarPedido);
router.get("/pedidos/:id", authMiddleware, getPedido);
router.get("/meus-pedidos", authMiddleware, getPedidos);
router.patch("/pedidos/:pedidoId/avancar-status", authMiddleware, requireAdmin, avancarStatusPedido);


module.exports = router;