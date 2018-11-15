const utils = require('ethereumjs-util')
const BlockHeader = require('ethereumjs-block/header')
const moment = require('moment');

function formatBlock(block) {
	

  const dataBuff = utils.toBuffer(block.extraData)
  const seal = dataBuff.slice(dataBuff.length - 65, dataBuff.length)
  const sig = utils.fromRpcSig(dataBuff.slice(dataBuff.length - 65, dataBuff.length))


  block.extraData = '0x' + utils.toBuffer(block.extraData).slice(0, dataBuff.length - 65).toString('hex')
  
  block.mixHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
  block.nonce = '0x0000000000000000';

  moment(block.timestamp)

  const headerHash = new BlockHeader({
    parentHash: utils.toBuffer(block.parentHash),
    uncleHash: utils.toBuffer(block.sha3Uncles),
    coinbase: utils.toBuffer(block.miner),
    stateRoot: utils.toBuffer(block.stateRoot),
    transactionTrie: Buffer.from(block.transactionsRoot.replace('0x', ''), 'hex'),
    receiptTrie: utils.toBuffer(block.receiptsRoot),
    bloom: utils.toBuffer(block.logsBloom),
    difficulty: utils.toBuffer(block.difficulty.toNumber()),
    number: utils.toBuffer(block.number.toNumber()),
    gasLimit: utils.toBuffer(block.gasLimit.toNumber()),
    gasUsed: utils.toBuffer(block.gasUsed.toNumber()),
    timestamp: utils.toBuffer(moment(block.timestamp).unix()),
    extraData: utils.toBuffer(block.extraData),
    mixHash: utils.toBuffer(block.mixHash),
    nonce: utils.toBuffer(block.nonce)
  })

  const pub = utils.ecrecover(headerHash.hash(), sig.v, sig.r, sig.s)

  const address = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))

  // console.log(address) 

  block.signer = address;

  block.extraDataVanity = '0x' + dataBuff.toString('hex').slice(0, 65)

  block.extraDataSeal = seal.toString('hex')

  block._extraextra = dataBuff.slice(32,dataBuff.length - 65).toString('hex')

  
  return block
}

module.exports = formatBlock;



