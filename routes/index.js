var format = require('../utils/blockformatter.js')

var express = require('express')
var router = express.Router()
var utils = require('ethers/utils')
var config = require('../config')
var blocks = require('../utils/cache/blocks')
var transactions = require('../utils/cache/transactions')
var parity = config.providers.parity

router.get('/', function (req, res, next) {
  Promise.all([
    blocks.count(),
    transactions.count()
  ])
    .then(([cachedBlocksCount, cachedTransactionsCount]) => {
      getBlocks(cachedBlocksCount)
        .then(blocks => {
          if (cachedTransactionsCount === 10) {
            return transactions.recent()
              .then(txs => {
                return res.render('index', {blocks, txs})
              })
          } else {
            const txs = []
            blocks.forEach(block => {
              block.transactions.forEach(function(tx) {
                if (txs.length === 10) {
                  return;
                }

                txs.push(tx);


              });
            })
            return res.render('index', {blocks, txs})
          }
        })
    })
})

function getBlocks (cachedBlocksCount) {
  if (cachedBlocksCount === 10) {
    return blocks.recent()
      .then((blocks) => {
        blocks.forEach(function (block, index, arr) {
          arr[index] = format(block)
        })
        return blocks
      })
  } else {
    return parity.getBlockNumber().then((lastBlockNumber) => {

      var jobs = []

      var blockCount = 10

      if (lastBlockNumber - blockCount < 0) {
        blockCount = lastBlockNumber + 1
      }

      for (var i = 0; i < blockCount; i++) {
        jobs.push(parity.send('eth_getBlockByNumber', [utils.hexlify(lastBlockNumber - i), true]))
      }

      return Promise.all(jobs).then(blocks => {
        blocks.forEach(function (block, index, arr) {
          arr[index] = format(block)
        })

        return blocks
      })
    })
  }
}

module.exports = router
