var config = require('../config')
var blocks = require('./blocks')

var utils = require('ethers/utils')

blocks.clear()
  .then(function () {
    config.providers.parity.on('block', onEachBlock)
  });

function onEachBlock (blockNumber) {
  blocks.recent()
  config.providers.parity.send('eth_getBlockByNumber', [utils.hexlify(blockNumber), true])
    .then(function (block) {
      blocks.add(block)
    })
}
