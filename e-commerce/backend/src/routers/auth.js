const express = require("express");

const {
  register,
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

const { getUsuarios } = require("../controllers/usersController");

const upload = require("../middleware/upload");


const router = express.Router();

// ---------- Auth ----------
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// ---------- Usuário ----------
router.get("/perfil", getMe);
router.patch("/perfil/:id", updateUser);
router.get("/user/:id", getUserById);
router.delete("/:id", excluirUsuario);
router.get("/usuarios", getUsuarios);

// ---------- Endereço ----------
router.post("/criar-endereco", createEndereco);
router.post("/:id/criar-endereco", createEndereco);
router.get("/meu-endereco", getEndereco);
router.get("/enderecos/:id", getEnderecosByUserId);
router.patch("/atualizar-endereco/:id", updateEndereco);
router.delete("/endereco/:id", deletarEndereco);

// ---------- Produtos ----------
router.post("/produtos", upload.single("imagem"), criarProduto);
router.get("/produtos/admin", listarProdutosAdmin);
router.get("/produtos", controller);
router.get("/produtos/:id", buscarProduto);
router.patch("/produtos/:id", atualizarProduto);
router.patch("/produtos/:id/desativar", desativarProduto);

// ---------- Pedidos ----------
router.get("/pedidos-info", getPedidosInfo);
router.get("/stats", getPedidosStats);

router.post("/criar-pedido", criarPedido);
router.get("/pedidos/:id", getPedido);
router.get("/meus-pedidos", getPedidos);


module.exports = router;