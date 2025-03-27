// db.js
const { Sequelize } = require('sequelize');

// PostgreSQL Connection
const host_i = 'localhost';
const port_i = 5432;

console.log(`[DB]: Connecting to ${host_i} ...`);

const sequelize = new Sequelize('voter_db', 'admin', 'root', {
    host: host_i,
    port: port_i,
    dialect: 'postgres'
});

// Test Database Connection
sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Error connecting to the database:", err));

module.exports = sequelize;  // Export sequelize instance
