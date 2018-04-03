var web3 = require('web3');
var names = require('./names/names.json')

var config = function () {
  
  this.logFormat = "combined";
  this.rpcPath = process.env.WEB3_HTTP_PROVIDER || "http://dpp-poa-secondary-poa.e4ff.pro-eu-west-1.openshiftapps.com" ;
  this.provider = new web3.providers.HttpProvider(this.rpcPath);
  
  this.bootstrapUrl = process.env.BOOTSTRAP_URL || "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/simplex/bootstrap.min.css";
  
  this.names = names;
  
}

module.exports = config;