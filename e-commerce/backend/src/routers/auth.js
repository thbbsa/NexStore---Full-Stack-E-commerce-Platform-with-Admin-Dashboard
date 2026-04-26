const express = require("express");
const { register, login, getMe, updateUser, logout, createEndereco, getEndereco, updateEndereco } = require("../controllers/userController");
const {
  criarProduto,
  listarProdutosAdmin,
  controller,
  excluirProduto,
  buscarProduto,
  atualizarProduto,
} = require("../controllers/produtoController");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/criar-endereco", createEndereco);
router.get("/meu-endereco", getEndereco);
router.patch("/atualizar-endereco/:id", updateEndereco);
router.get("/perfil", getMe);
router.patch("/perfil/:id", updateUser)


router.post(
  "/produtos",
  upload.single("imagem"),
  criarProduto
);

router.get("/produtos/admin", listarProdutosAdmin);

router.get("/produtos", controller);

router.delete("/produtos/:id", excluirProduto)

router.get("/produtos/:id", buscarProduto)

router.patch("/produtos/:id", atualizarProduto);

module.exports = router;
