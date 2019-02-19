var web3 = require('web3')
var names = require('./names/names.json')
const ethers = require('ethers')

var config = {
  logFormat: 'combined',
  rpc: {
    parity: process.env.RPC_URL_PARITY || 'http://parity-rpc:8545',
    pantheon: process.env.RPC_URL_PANTHEON || 'http://pantheon-rpc:8545'
  },
  rpcPath () {
    return this.rpc.parity
  },
  provider () {
    return new web3.providers.HttpProvider(this.rpc.parity)
  },
  providers: {
    parity () {
      return new ethers.providers.JsonRpcProvider(this.rpc.parity)
    },
    pantheon () {
      new ethers.providers.JsonRpcProvider(this.rpc.pantheon)
    }
  },
  bootstrapUrl: process.env.BOOTSTRAP_URL || 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/simplex/bootstrap.min.css',
  explorerName: 'Görli Block Explorer',
  legalNoticeLink: 'https://github.com/DAPowerPlay/goerli-explorer/blob/goerli-explorer/LICENSE',
  names: names
}

module.exports = config
