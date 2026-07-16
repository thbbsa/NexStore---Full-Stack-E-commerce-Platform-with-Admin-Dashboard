/* ===============================
   BANCO DE DADOS - SISTEMA ECOMMERCE (NÍVEL EMPRESA)
   =============================== */

USE master;
GO

IF DB_ID('SistemaEcommerce') IS NOT NULL
BEGIN
    ALTER DATABASE SistemaEcommerce SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
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
    Role NVARCHAR(50) NOT NULL DEFAULT 'user'
        CHECK (Role IN ('user', 'admin')),
    Ativo BIT NOT NULL DEFAULT 1,
    CriadoEm DATETIME DEFAULT GETDATE()
);
GO

/* ===============================
   ENDEREÇOS
   =============================== */
CREATE TABLE Endereco (
    Id_endereco INT IDENTITY(1,1) PRIMARY KEY,
    Rua VARCHAR(150) NOT NULL,
    Numero VARCHAR(10) NULL,
    Complemento VARCHAR(100) NULL,
    Bairro VARCHAR(100) NULL,
    Cidade VARCHAR(100) NULL,
    Estado VARCHAR(100) NULL,
    Cep CHAR(10) NULL,
    Principal BIT NOT NULL DEFAULT 0,
    UsuarioId INT NOT NULL,

    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);
GO

-- Garante no máximo 1 endereço Principal = 1 por usuário
CREATE UNIQUE INDEX UX_Endereco_Principal
ON Endereco(UsuarioId)
WHERE Principal = 1;
GO

CREATE INDEX IX_Endereco_UsuarioId ON Endereco(UsuarioId);
GO

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
    SKU NVARCHAR(50) NOT NULL UNIQUE,
    DescricaoCurta NVARCHAR(300),
    DescricaoCompleta NVARCHAR(MAX),
    Imagem NVARCHAR(255),
    Ativo BIT DEFAULT 1,
    CriadoEm DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id)
);
GO

CREATE INDEX IX_Produtos_CategoriaId ON Produtos(CategoriaId);
GO

/* ===============================
   PEDIDOS
   =============================== */
CREATE TABLE Pedidos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    EnderecoId INT NOT NULL,

    DataPedido DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pendente'
        CHECK (Status IN ('Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado')),
    Total DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    FOREIGN KEY (EnderecoId) REFERENCES Endereco(Id_endereco)
);
GO

CREATE INDEX IX_Pedidos_UsuarioId ON Pedidos(UsuarioId);
CREATE INDEX IX_Pedidos_Status ON Pedidos(Status);
GO

/* ===============================
   ITENS DO PEDIDO
   =============================== */
CREATE TABLE PedidoItens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,
    ProdutoId INT NOT NULL,

    Quantidade INT NOT NULL CHECK (Quantidade > 0),
    PrecoUnitario DECIMAL(10,2) NOT NULL CHECK (PrecoUnitario >= 0),
    Subtotal AS (Quantidade * PrecoUnitario),

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id),
    FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id)
);
GO

CREATE INDEX IX_PedidoItens_PedidoId ON PedidoItens(PedidoId);
CREATE INDEX IX_PedidoItens_ProdutoId ON PedidoItens(ProdutoId);
GO

/* ===============================
   PAGAMENTOS
   =============================== */
CREATE TABLE Pagamentos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,

    Metodo NVARCHAR(50) NOT NULL
        CHECK (Metodo IN ('Cartao', 'Boleto', 'Pix', 'Transferencia')),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pendente'
        CHECK (Status IN ('Pendente', 'Aprovado', 'Recusado', 'Estornado')),
    Valor DECIMAL(10,2) NOT NULL CHECK (Valor >= 0),
    DataPagamento DATETIME,

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

CREATE INDEX IX_Pagamentos_PedidoId ON Pagamentos(PedidoId);
GO

/* ===============================
   ENTREGAS
   =============================== */
CREATE TABLE Entregas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,

    Status NVARCHAR(50) NOT NULL DEFAULT 'Preparando'
        CHECK (Status IN ('Preparando', 'Enviado', 'EmTransito', 'Entregue', 'Devolvido')),
    CodigoRastreio NVARCHAR(100),
    DataEnvio DATETIME,
    DataEntrega DATETIME,

    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

CREATE INDEX IX_Entregas_PedidoId ON Entregas(PedidoId);
GO

/* ===============================
   HISTÓRICO DE ESTOQUE
   =============================== */
CREATE TABLE EstoqueMovimentacoes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProdutoId INT NOT NULL,

    Tipo NVARCHAR(20) NOT NULL
        CHECK (Tipo IN ('Entrada', 'Saida', 'Ajuste')),
    Quantidade INT NOT NULL CHECK (Quantidade > 0),

    Origem NVARCHAR(50),
    PedidoId INT NULL,

    DataMovimentacao DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id),
    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id)
);
GO

CREATE INDEX IX_EstoqueMovimentacoes_ProdutoId ON EstoqueMovimentacoes(ProdutoId);
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

CREATE INDEX IX_PedidoHistorico_PedidoId ON PedidoHistorico(PedidoId);
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
    SET NOCOUNT ON;

    -- Bloqueia a venda se não houver estoque suficiente para algum item
    IF EXISTS (
        SELECT 1
        FROM inserted I
        INNER JOIN Produtos P ON P.Id = I.ProdutoId
        WHERE P.Estoque < I.Quantidade
    )
    BEGIN
        RAISERROR('Estoque insuficiente para um ou mais produtos do pedido.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

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
    SET NOCOUNT ON;

    -- Só grava histórico quando o Status realmente mudou
    IF UPDATE(Status)
    BEGIN
        INSERT INTO PedidoHistorico (PedidoId, Status)
        SELECT i.Id, i.Status
        FROM inserted i
        INNER JOIN deleted d ON d.Id = i.Id
        WHERE i.Status <> d.Status;
    END
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
    SET NOCOUNT ON;

    DECLARE @IsInsert BIT = CASE WHEN EXISTS(SELECT 1 FROM inserted) THEN 1 ELSE 0 END;
    DECLARE @IsDelete BIT = CASE WHEN EXISTS(SELECT 1 FROM deleted) THEN 1 ELSE 0 END;

    IF @IsInsert = 1 AND @IsDelete = 0
    BEGIN
        -- INSERT puro
        INSERT INTO Auditoria (Tabela, Acao, RegistroId, DadosDepois)
        SELECT 'Produtos', 'INSERT', Id, Nome
        FROM inserted;
    END
    ELSE IF @IsInsert = 0 AND @IsDelete = 1
    BEGIN
        -- DELETE puro
        INSERT INTO Auditoria (Tabela, Acao, RegistroId, DadosAntes)
        SELECT 'Produtos', 'DELETE', Id, Nome
        FROM deleted;
    END
    ELSE IF @IsInsert = 1 AND @IsDelete = 1
    BEGIN
        -- UPDATE
        INSERT INTO Auditoria (Tabela, Acao, RegistroId, DadosAntes, DadosDepois)
        SELECT 'Produtos', 'UPDATE', d.Id, d.Nome, i.Nome
        FROM deleted d
        JOIN inserted i ON d.Id = i.Id;
    END
END;
GO