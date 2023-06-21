const { MongoClient } = require("mongodb");
var mongojs = require('mongojs');

var config = {}

try {
   
    var config = {}
    // config.db = mongojs('mongodb://admin:12345@localhost:27017/myedu?authSource=admin');
    config.db = mongojs('mongodb://localhost:27017/RSP');
    console.log(`Database connection successful`);


} catch (error) {
    console.log(`connect error: ${error}`);
}

config.domain = 'http://localhost:5002';
config.base = 'http://localhost:5002/';
config.title="RSP"

module.exports = config;