const { MongoClient } = require("mongodb");
var mongojs = require('mongojs');

var config = {}

try {
   
    var config = {}
    // config.db = mongojs('mongodb://admin:12345@localhost:27017/myedu?authSource=admin');
    // config.db = mongojs('mongodb://localhost:27017/RSP');
    config.db=mongojs('mongodb+srv://jsuser:Di12345@cluster0.zb8r5jj.mongodb.net/?retryWrites=true&w=majority')
    console.log(`Database connection successful`);


} catch (error) {
    console.log(`connect error: ${error}`);
}

config.domain = 'http://localhost:5002';
config.base = 'http://localhost:5002/';
config.title="RSP"

module.exports = config;