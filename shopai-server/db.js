const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'ducquy', // ⚠️ Thay mật khẩu PostgreSQL của bạn vào đây
    database: 'postgres',                  // Tên DB trên pgAdmin4 của bạn
});

module.exports = pool;