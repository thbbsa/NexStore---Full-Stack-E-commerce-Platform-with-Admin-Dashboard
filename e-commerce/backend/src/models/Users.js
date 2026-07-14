const { sql, conectar } = require("../config/db");

class Users {
    static async getUsuarios() {
        try {
            const pool = await conectar();
            const result = await pool.request()
                .query("Select Id, Nome, Username, Email, Role FROM Usuarios");

            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Users;