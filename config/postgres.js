const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: "postgres",
    dialectModule: require("pg"),
    logging: false   // hide SQL logs
});

module.exports = { sequelize };
