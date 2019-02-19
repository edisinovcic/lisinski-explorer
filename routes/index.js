var format = require('../utils/blockformatter.js')

var express = require('express')
var router = express.Router()
var utils = require('ethers/utils')
var config = require('../config')
var parity = config.providers.parity

router.get('/', function (req, res, next) {

  parity.getBlockNumber().then((lastBlockNumber) => {

    var jobs = []

    var blockCount = 10

    if (lastBlockNumber - blockCount < 0) {
      blockCount = lastBlockNumber + 1
    }

    for (var i = 0; i < blockCount; i++) {
      jobs.push(parity.send('eth_getBlockByNumber', [utils.hexlify(lastBlockNumber - i), true]))
    }

    Promise.all(jobs).then(blocks => {
      var txs = []
      blocks.forEach(function (block) {
        block.transactions.forEach(function (tx) {
          if (txs.length === 10) {
            return
          }

          txs.push(tx)

        })
        block = format(block)
        block.signerName = config.names[block.signer]
      })

      res.render('index', {blocks: blocks, txs: txs})
    })
  })

})

module.exports = router
