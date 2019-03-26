const utils = require('ethereumjs-util')
const etherUtils = require('ethers/utils')
const ethBlock = require('ethereumjs-block/from-rpc')

function formatBlock(block) {
       const dataBuff = utils.toBuffer(block.extraData)
       const seal = dataBuff.slice(dataBuff.length - 65, dataBuff.length)

        block.mixHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
        if(!block.nonce) {
            block.nonce = '0x0000000000000000'
        } else {
            block.nonce = '0x' + block.nonce.toString(16);
        }


       block.signer = extractSigner(block);

       block.extraDataVanity = '0x' + dataBuff.toString('hex').slice(0, 64)
       block.extraDataVanityToAscii = toAscii(block.extraDataVanity)

       block.extraDataSeal = seal.toString('hex')

       block._extraextra = dataBuff.slice(32,dataBuff.length - 65).toString('hex')
       block.number = etherUtils.bigNumberify(block.number).toNumber()
       return block
}

function extractSigner(block_) {


  var block = Object.assign({}, block_);

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

function toAscii(hex) {
  // Find termination
  var str = "";
  var i = 0, l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i+=2) {
    var code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}


module.exports = formatBlock;
