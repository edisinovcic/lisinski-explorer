var web3 = require('web3');
var names = require('./names/names.json')

var config = function () {
  
  this.logFormat = "combined";
  this.rpcPath = process.env.RPC_URL
  this.provider = new web3.providers.HttpProvider(this.rpcPath);
  
  this.bootstrapUrl = process.env.BOOTSTRAP_URL || "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/simplex/bootstrap.min.css";
  this.explorerName = "Görli Block Explorer"
  this.legalNoticeLink = "https://github.com/DAPowerPlay/goerli-explorer/blob/goerli-explorer/LICENSE"
  this.names = names;
  
}

module.exports = config;