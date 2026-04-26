const sql = require("mssql");

// Configuração da conexão
const config = {
    user: "sa",
    password: "pw_user_app",
    server: "localhost",
    database: "SistemaEcommerce",
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
