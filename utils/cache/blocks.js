var config = require('../../config')
var { promisify } = require('util')
var redis = config.redis.client

const RECENT_BLOCKS_KEY = 'explore_recent_blocks'

function add (block) {
  //simulating circle list with 10 elements
  if (!redis) return
  redis.lpush(RECENT_BLOCKS_KEY, JSON.stringify(block), function (err, suc) {
    redis.ltrim(RECENT_BLOCKS_KEY, 0, 9)
  })
}

function clear () {
  if (!redis) return
  return asyncCommand('del')(RECENT_BLOCKS_KEY)
}

function count () {
  if (!redis) return 0;
  return asyncCommand('llen')(RECENT_BLOCKS_KEY)
}

function recent () {
  if (!redis) return
  return asyncCommand('lrange')(RECENT_BLOCKS_KEY, 0, 9)
    .then(function (array) {
      array.forEach(function (elem, i, arr) {
        arr[i] = JSON.parse(elem)
      })
      return array
    })
}

function asyncCommand (command) {
  return promisify(redis[command]).bind(redis)
}

module.exports = {
  add: add,
  recent: recent,
  clear: clear,
  count: count
}
