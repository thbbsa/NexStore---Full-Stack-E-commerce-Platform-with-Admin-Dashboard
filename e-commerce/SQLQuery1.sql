/* ===============================
   BANCO DE DADOS - SISTEMA ECOMMERCE (NÍVEL EMPRESA)
   =============================== */

IF DB_ID('SistemaEcommerce') IS NOT NULL
BEGIN
    DROP DATABASE SistemaEcommerce;
END
GO

CREATE DATABASE SistemaEcommerce;
GO

USE SistemaEcommerce;
GO

/* ===============================
   USUÁRIOS
   =============================== */
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    CPF CHAR(11) NOT NULL UNIQUE,
    Telefone CHAR(11) NOT NULL,
    Senha NVARCHAR(200) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'user',
    CriadoEm DATETIME DEFAULT GETDATE()
);
GO

/* ===============================
   ENDEREÇOS
   =============================== */
c

/* ===============================
   CATEGORIAS
   =============================== */
CREATE TABLE Categorias (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL UNIQUE
);
GO

INSERT INTO Categorias (Nome) VALUES
('Hardware'),
('Periféricos'),
('Computadores'),
('Games'),
('Celular & Smartphone'),
('Áudio');
GO

/* ===============================
   PRODUTOS
   =============================== */
CREATE TABLE Produtos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(150) NOT NULL,
    Marca NVARCHAR(100),
    CategoriaId INT NOT NULL,
    Preco DECIMAL(10,2) NOT NULL,
    PrecoPromocional DECIMAL(10,2),
    Estoque INT NOT NULL CHECK (Estoque >= 0),
    SKU NVARCHAR(50),
    DescricaoCurta NVARCHAR(300),
    DescricaoCompleta NVARCHAR(MAX),
    Imagem NVARCHAR(255),
    Ativo BIT DEFAULT 1,
    CriadoEm DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id)
);
GO

/* ===============================
   PEDIDOS
   =============================== */
CREATE TABLE Pedidos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    EnderecoId INT NOT NULL,

    DataPedido DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) DEFAULT 'Pendente',
    Total DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    FOREIGN KEY (EnderecoId) REFERENCES Endereco(Id_endereco)
);
GO

/* ===============================
   ITENS DO PEDIDO
   =============================== */
CREATE TABLE PedidoItens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,
    ProdutoId INT NOT NULL,

    Quantidade INT NOT NULL,
    PrecoUnitario DECIMAL(10,2) NOT NULL,
    Subtotal AS (Quantidade * PrecoUnitario),

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id),
    FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id)
);
GO

/* ===============================
   PAGAMENTOS
   =============================== */
CREATE TABLE Pagamentos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,

    Metodo NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pendente',
    Valor DECIMAL(10,2) NOT NULL,
    DataPagamento DATETIME,

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

/* ===============================
   ENTREGAS
   =============================== */
CREATE TABLE Entregas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,

    Status NVARCHAR(50) DEFAULT 'Preparando',
    CodigoRastreio NVARCHAR(100),
    DataEnvio DATETIME,
    DataEntrega DATETIME,

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

/* ===============================
   HISTÓRICO DE ESTOQUE
   =============================== */
CREATE TABLE EstoqueMovimentacoes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProdutoId INT NOT NULL,

    Tipo NVARCHAR(20) NOT NULL,
    Quantidade INT NOT NULL,

    Origem NVARCHAR(50),
    PedidoId INT NULL,

    DataMovimentacao DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id),
    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

/* ===============================
   HISTÓRICO DE STATUS DO PEDIDO
   =============================== */
CREATE TABLE PedidoHistorico (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,
    Status NVARCHAR(50),
    Data DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

/* ===============================
   AUDITORIA GLOBAL
   =============================== */
CREATE TABLE Auditoria (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Tabela NVARCHAR(100),
    Acao NVARCHAR(10),
    RegistroId INT,
    Data DATETIME DEFAULT GETDATE(),
    DadosAntes NVARCHAR(MAX),
    DadosDepois NVARCHAR(MAX)
);
GO

/* ===============================
   TRIGGER - BAIXAR ESTOQUE
   =============================== */
CREATE TRIGGER TRG_BaixarEstoque
ON PedidoItens
AFTER INSERT
AS
BEGIN
    UPDATE P
    SET P.Estoque = P.Estoque - I.Quantidade
    FROM Produtos P
    INNER JOIN inserted I ON P.Id = I.ProdutoId;

    INSERT INTO EstoqueMovimentacoes (ProdutoId, Tipo, Quantidade, Origem, PedidoId)
    SELECT 
        ProdutoId,
        'Saida',
        Quantidade,
        'Pedido',
        PedidoId
    FROM inserted;
END;
GO

/* ===============================
   TRIGGER - HISTÓRICO DE PEDIDO
   =============================== */
CREATE TRIGGER TRG_HistoricoPedido
ON Pedidos
AFTER UPDATE
AS
BEGIN
    INSERT INTO PedidoHistorico (PedidoId, Status)
    SELECT Id, Status
    FROM inserted;
END;
GO

/* ===============================
   TRIGGER - AUDITORIA PRODUTOS
   =============================== */
CREATE TRIGGER TRG_Auditoria_Produtos
ON Produtos
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- INSERT
    INSERT INTO Auditoria (Tabela, Acao, RegistroId, DadosDepois)
    SELECT 'Produtos', 'INSERT', Id, Nome
    FROM inserted;

    -- DELETE
    INSERT INTO Auditoria (Tabela, Acao, RegistroId, DadosAntes)
    SELECT 'Produtos', 'DELETE', Id, Nome
    FROM deleted;

    -- UPDATE
    INSERT INTO Auditoria (Tabela, Acao, RegistroId, DadosAntes, DadosDepois)
    SELECT 'Produtos', 'UPDATE', d.Id, d.Nome, i.Nome
    FROM deleted d
    JOIN inserted i ON d.Id = i.Id;
END;
GO