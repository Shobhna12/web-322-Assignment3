const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    logging: false   // hide SQL logs
});

module.exports = { sequelize };
