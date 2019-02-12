const utils = require('ethereumjs-util')
const ethBlock = require('ethereumjs-block/from-rpc')
const moment = require('moment');
var config = new(require('../config.js'))();
var Web3 = require('web3');

var web3 = new Web3()



var Api = require('@parity/api')
const provider = new Api.Provider.Http(config.rpc.pantheon);
const api = new Api(provider);

function formatBlock(block) {
       const dataBuff = utils.toBuffer(block.extraData)
       const seal = dataBuff.slice(dataBuff.length - 65, dataBuff.length)
       const sig = utils.fromRpcSig(dataBuff.slice(dataBuff.length - 65, dataBuff.length))

        block.mixHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
        //console.log(block)
        //if(typeof block.nonce !== 'undefined') {console.log(block.nonce)}
        if(typeof block.nonce === 'undefined' || block.nonce.toString(16) === '0') {
            //console.log('if')
            block.nonce = '0x0000000000000000'
        } else {
            //console.log('else')
            block.nonce = '0x' + block.nonce.toString(16);
        }
    

       block.signer = extractSigner(block);

       block.extraDataVanity = '0x' + dataBuff.toString('hex').slice(0, 64) 
       block.extraDataVanityToAscii = web3.toAscii(block.extraDataVanity)

       block.extraDataSeal = seal.toString('hex')

       block._extraextra = dataBuff.slice(32,dataBuff.length - 65).toString('hex')
    
       return block 
}

function extractSigner(block_) {


  var block = Object.assign({}, block_);
  block.difficulty = '0x' + block.difficulty.toString(16)
  block.totalDifficulty = '0x' + block.totalDifficulty.toString(16)
  block.number = '0x' + block.number.toString(16)
  block.gasLimit = '0x' + block.gasLimit.toString(16)
  block.gasUsed = '0x' + block.gasUsed.toString(16)
  block.timestamp = moment(block.timestamp).unix()

  var sealers = block.extraData
  if (sealers.length <= 130)
    return undefined
  var sig = utils.fromRpcSig('0x' + sealers.substring(sealers.length - 130, sealers.length)) // remove signature
  block.extraData = block.extraData.substring(0, block.extraData.length - 130)
  
  var blk = ethBlock(block)

  blk.header.difficulty[0] = block.difficulty
  var sigHash = utils.sha3(blk.header.serialize())
  var pubkey
  var address
  try {
    pubkey = utils.ecrecover(sigHash, sig.v, sig.r, sig.s)
    address = utils.addHexPrefix(utils.pubToAddress(pubkey).toString('hex'))
  } catch (e) {
    address = ''
  }
  return address;
  
}

module.exports = formatBlock;
