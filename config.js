
const ip = require('ip');

// web server config
const config = {
    "port": 15050,
    "ip": ip.address()
};

module.exports = config;