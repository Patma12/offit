require('dotenv').config();

const config = {
    port: process.env.PORT || 8000,
    mongodb: {
        uri: process.env.MONGODB_URI,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
    }
}

module.exports = config;