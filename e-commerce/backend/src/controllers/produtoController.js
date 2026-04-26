const Produto = require("../models/Produto");

exports.criarProduto = async (req, res) => {
  try {
    const produto = JSON.parse(req.body.produto);
    const imagem = req.file;

    if (!imagem) {
      return res.status(400).json({ error: "Imagem obrigatória" });
    }

    const imagemPath = `/uploads/produtos/${imagem.filename}`;

    const produtoCriado = Produto.createProduct(produto, imagemPath);

    return res.status(201).json({
      message: "Produto criado com sucesso",
      produtoCriado
    });

  } catch (error) {
    console.error("ERRO:", error);
    return res.status(500).json({ error: "Erro ao criar produto" });
  }
};

exports.listarProdutosAdmin = async (req, res) => {
  try {
    const produtos = await Produto.getProdutos();
    res.status(200).json(produtos); 
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

exports.controller = async (req, res) => {
  try {
    const query = req.query.q;
    const category = req.query.categoria
      ? parseInt(req.query.categoria)
      : null;
      
    if (query) {
      const produtos = await Produto.buscarPorQuery(query, category);

      return res.status(200).json(produtos);
    } else if (category) {
      const produtos = await Produto.buscarPorQuery(null, category);
      console.log(produtos)
      return res.status(200).json(produtos);
    } else {
      const produtos = await Produto.getProdutos(true);
      return res.status(200).json(produtos);
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produtos", err: err.message });
  }
};


exports.excluirProduto = async (req, res) => {
  const { id } = req.params;

  try {
    await Produto.excluir(id);
    res.status(200).json({ mensagem: "Produto excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir produto" });
  }
};

exports.buscarProduto = async (req, res) => {
  const id = req.params.id;

  try {
    const produto = await Produto.getProduto(id);
    res.status(200).json({ mensagem: "Produto buscado com sucesso", produto });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produto" });
  }
}

exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    if (!dados || Object.keys(dados).length === 0) {
      return res.status(400).json({ erro: "Nenhum dado para atualizar" });
    }

    const produtoAtualizado = await Produto.atualizar(id, dados);
    res.json(produtoAtualizado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar produto", error });
  }
};

