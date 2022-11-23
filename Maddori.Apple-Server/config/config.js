require('dotenv').config();
const env = process.env;

const development = {
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        useUTC: false, // for reading from database
    },
    port: env.DB_PORT || "3306",
    timezone: "+09:00"
};

module.exports = { development };