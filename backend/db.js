// db.js
const { Sequelize } = require('sequelize');

const host_i = process.env.DB_HOST || 'localhost';
const port_i = Number(process.env.DB_PORT || 5432);
const database = process.env.DB_NAME || 'voter_db';
const username = process.env.DB_USER || 'admin';
const password = process.env.DB_PASSWORD || 'root';

console.log(`[DB]: Connecting to ${host_i}:${port_i} (${database}) ...`);

const sequelize = new Sequelize(database, username, password, {
    host: host_i,
    port: port_i,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === '1' ? console.log : false,
});

// Test Database Connection
sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Error connecting to the database:", err));

module.exports = sequelize;  // Export sequelize instance
