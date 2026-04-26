const { sql, conectar } = require("../config/db");

class Produto {

    static async createProduct(produto, imagemPath) {
        try {
            const pool = await conectar();

            const result = await pool.request()
                .input("Nome", sql.NVarChar(100), produto.nome)
                .input("Marca", sql.NVarChar(100), produto.marca)
                .input("CategoriaId", sql.Int, produto.categoria)
                .input("Preco", sql.Decimal(10, 2), produto.preco)
                .input("PrecoPromocional", sql.Decimal(10, 2), produto.precoPromocional)
                .input("Estoque", sql.Int, produto.quantidade)
                .input("SKU", sql.NVarChar(100), produto.sku)
                .input("Ativo", sql.Bit, produto.ativo)
                .input("DescricaoCurta", sql.NVarChar(sql.MAX), produto.descricaoCurta)
                .input("DescricaoCompleta", sql.NVarChar(sql.MAX), produto.descricaoCompleta)
                .input("Imagem", sql.NVarChar(255), imagemPath)
                .query(`
                   INSERT INTO Produtos (
                    Nome,
                    Marca,
                    CategoriaId,
                    Preco,
                    PrecoPromocional,
                    Estoque,
                    SKU,
                    Ativo,
                    DescricaoCurta,
                    DescricaoCompleta,
                    Imagem
                )
                VALUES (
                    @Nome,
                    @Marca,
                    @CategoriaId,
                    @Preco,
                    @PrecoPromocional,
                    @Estoque,
                    @SKU,
                    @Ativo,
                    @DescricaoCurta,
                    @DescricaoCompleta,
                    @Imagem
                );
                    SELECT SCOPE_IDENTITY() AS id;
                `);

            return result.recordset[0]; // retorna o ID criado

        } catch (error) {
            console.error("Erro ao criar produto:", error);
            throw error;
        }
    }

    static async getProdutos(ativo) {
        try {
            const pool = await conectar();

            let query = `
            SELECT
                Id,
                Nome,
                CategoriaId,
                Preco,
                PrecoPromocional,
                Ativo,
                Imagem
            FROM Produtos
        `;

            if (ativo === true) {
                query += ` WHERE Ativo = 1`;
            }

            const result = await pool.request().query(query);
            return result.recordset;

        } catch (error) {
            throw error;
        }
    }


    static async excluir(id) {
        const pool = await conectar();
        await pool.request()
            .input("Id", sql.Int, id)
            .query("DELETE FROM Produtos WHERE Id = @Id");
    }

    static async getProduto(id) {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .input("Id", sql.Int, id)
                .query("Select * FROM Produtos WHERE Id = @Id");

            return result.recordset[0];
        } catch (error) {
            console.log('erro ao buscar produto', error)
        }
    }

    static async atualizar(id, produto) {
        const pool = await conectar();

        const campos = [];
        const request = pool.request().input("Id", sql.Int, id);

        for (const [campo, valor] of Object.entries(produto)) {
            if (valor !== undefined) {
                campos.push(`${campo} = @${campo}`);
                request.input(campo, valor);
            }
        }

        if (campos.length === 0) {
            throw new Error("Nenhum campo válido para atualizar");
        }

        const query = `
    UPDATE Produtos
    SET ${campos.join(", ")}
    WHERE Id = @Id
  `;

        await request.query(query);
        return this.getProduto(id);
    }

    static async buscarPorQuery(query, categoryId) {
    try {
        const pool = await conectar();

        let sqlQuery = `
            SELECT
                P.Id,
                P.Nome,
                P.CategoriaId,
                C.Nome AS CategoriaNome,
                P.Preco,
                P.PrecoPromocional,
                P.Ativo,
                P.Imagem
            FROM Produtos P
            JOIN Categorias C ON P.CategoriaId = C.Id
            WHERE P.Ativo = 1
        `;

        if (query) {
            sqlQuery += ` AND P.Nome LIKE @Query`;
        }

        if (categoryId) {
            sqlQuery += ` AND P.CategoriaId = @Categoria`;
        }
        
        const request = pool.request();

        if (query) {
            request.input("Query", sql.NVarChar(255), `%${query}%`);
        }

        if (categoryId) {
            request.input("Categoria", sql.Int, categoryId);
        }

        const result = await request.query(sqlQuery);

        return result.recordset;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
}

}

module.exports = Produto