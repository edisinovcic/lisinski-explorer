var config = require('../config')
var blocks = require('./cache/blocks')
var transactions = require('./cache/transactions')

var utils = require('ethers/utils')

//clear stale data on startup
Promise.all([
  blocks.clear(),
  transactions.clear()
]).then(
  function () {
    config.providers.parity.on('block', onEachBlock)
  }
)

function onEachBlock (blockNumber) {
  blocks.recent()
  config.providers.parity.send('eth_getBlockByNumber', [utils.hexlify(blockNumber), true])
    .then(function (block) {
      blocks.add(block)
      transactions.addAll(block.transactions)
    })
}
