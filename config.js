var web3 = require('web3');
var names = require('./names/names.json')

var config = function () {
  
  this.logFormat = "combined";

  this.rpc = {
  	  parity : process.env.RPC_URL_PARITY || "http://goerli-parity-ephemeral-secondary-rpc-poa.osapp.powerplay.local",
  	  pantheon : process.env.RPC_URL_PANTHEON || "http://pantheon-rpc-goerli-testnet.osapp.powerplay.local"
  } 
  this.rpcPath = this.rpc.parity
  this.provider = new web3.providers.HttpProvider(this.rpc.parity);
  
  this.bootstrapUrl = process.env.BOOTSTRAP_URL || "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/simplex/bootstrap.min.css";
  this.explorerName = "Görli Block Explorer"
  this.legalNoticeLink = "https://github.com/DAPowerPlay/goerli-explorer/blob/goerli-explorer/LICENSE"
  this.names = names;

}

module.exports = config;