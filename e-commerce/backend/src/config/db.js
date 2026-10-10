const sql = require("mssql");

// Configuração da conexão
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};

// Criar pool global
let pool;

async function conectar() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log("Conectado ao SQL Server!");
        } catch (err) {
            console.error("Erro ao conectar:", err);
            throw err;
        }
    }
    return pool;
}

module.exports = { sql, conectar };
