const express = require("express");
const { register, login, getMe, getUserById, updateUser, logout, createEndereco, getEndereco, getEnderecosByUserId, updateEndereco, excluirUsuario, deletarEndereco } = require("../controllers/userController");
const {
  criarProduto,
  listarProdutosAdmin,
  controller,
  desativarProduto,
  buscarProduto,
  atualizarProduto,
} = require("../controllers/produtoController");

const { criarPedido, getPedido, getPedidos } = require('../controllers/PedidoController')

const { getUsuarios } = require("../controllers/usersController")

const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/criar-endereco", createEndereco);
router.post("/:id/criar-endereco", createEndereco);
router.get("/meu-endereco", getEndereco);
router.get("/enderecos/:id", getEnderecosByUserId);
router.patch("/atualizar-endereco/:id", updateEndereco);
router.get("/perfil", getMe);
router.patch("/perfil/:id", updateUser);
router.get("/user/:id", getUserById);

router.delete("/endereco/:id", deletarEndereco);
router.delete("/:id", excluirUsuario);



router.post(
  "/produtos",
  upload.single("imagem"),
  criarProduto
);

router.get("/produtos/admin", listarProdutosAdmin);

router.get("/produtos", controller);

router.patch("/produtos/:id/desativar", desativarProduto);

router.get("/produtos/:id", buscarProduto)

router.patch("/produtos/:id", atualizarProduto);


router.post("/criar-pedido", criarPedido)
router.get("/pedidos/:id", getPedido)
router.get('/meus-pedidos', getPedidos);

router.get("/usuarios", getUsuarios);

module.exports = router;


