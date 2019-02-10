var express = require('express');
var router = express.Router();
var async = require('async');
var stringSimilarity = require('string-similarity');
var solc = require('solc');
var Web3 = require('web3');
var solcVersions = require('../utils/solc-versions')

router.get('/verify', function(req, res, next) {
  solcVersions.getSupportedReleases(function(versions) {
    res.render('verifyContract', { versions: versions });
  });
});

router.post('/verify', function(req, res, next) {

  solcVersions.getSupportedReleases(function(versions) {
    var config = req.app.get('config');
    var web3 = new Web3();
    web3.setProvider(config.provider);

    var contractAddress = req.body.contractAddress.toLowerCase();
    var contractName = req.body.contractName;
    var contractSource = req.body.contractSource;
    var compilerVersion = solcVersions.getRelease(versions, req.body.compilerVersion)[0];
    var optimize = !!req.body.useOptimizations;

    if (!contractAddress) {
      res.render('verifyContract',
        {
          versions,
          message: "No contract address provided.",
          contractName,
          contractSource,
          compilerVersion: compilerVersion.longVersion
        });
      return;
    }
    if (!contractName) {
      res.render('verifyContract',
        {
          versions,
          message: "No contract name provided.",
          contractAddress,
          contractSource,
          compilerVersion: compilerVersion.longVersion
        });
      return;
    }
    if (!contractSource) {
      res.render('verifyContract',
        {
          versions,
          message: "No contract source provided.",
          contractAddress,
          contractName,
          compilerVersion: compilerVersion.longVersion
        });
      return;
    }
    if (!compilerVersion) {
      res.render('verifyContract',
        {
          versions: versions,
          message: "No or invalid compiler version provided.",
          contractAddress,
          contractName,
          contractSource
        });
      return;
    }

    async.waterfall([
      function(callback) {
        web3.trace.filter({ "fromBlock": "0x00", "toAddress": [ contractAddress ] }, function(err, traces) {
          console.log("Received traces for contract address: " + contractAddress);
          callback(err, traces);
        });
      }, function(traces, callback) {
        var creationBytecode = null;
        traces.forEach(function(trace) {
          if (trace.type === "create" && trace.result.address === contractAddress && !trace.error) {
            creationBytecode = trace.action.init;
          }
        });


        console.log("Processed traces for contract address: " + contractAddress);
        if (!creationBytecode) {
          callback("Contract("+ contractAddress + ") creation transaction not found");
        } else {
          callback(null, creationBytecode);
        }
      }, function(creationBytecode, callback) {

        console.log('Compiler version ' + compilerVersion.longVersion)
        solc.loadRemoteVersion('v'+compilerVersion.longVersion, function (err, solcSnapshot) {
          if(err) {
            console.log('Failed to fetch solc compiler version. ', err);
            return callback(err, null)
          }
          var input = {
            language: 'Solidity',
            sources: {},
            settings: {
              optimizer: {
                enabled: optimize
              },
              outputSelection: {
                '*': {
                  '*': [ 'abi', 'evm.bytecode' ]
                }
              }
            }
          };
          input.sources['contract'] = {
            content: contractSource
          };

          var output = JSON.parse(solcSnapshot.compileStandard(JSON.stringify(input)))

          if(output.errors && output.errors.length > 0) {
            return callback(output.errors[0].message, null);
          }
          var contractBytecode;
          var abi;

          for (var contractName in output.contracts['contract']) {
            contractBytecode = "0x" +output.contracts['contract'][contractName].evm.bytecode.object;
            abi = output.contracts['contract'][contractName].abi;
          }

          // Remove swarm hash
          var blockchainBytecodeClean = creationBytecode.replace(/a165627a7a72305820.{64}0029/gi, "");
          var contractBytecodeClean = contractBytecode.replace(/a165627a7a72305820.{64}0029/gi, "");

          // Check if we have any constructor arguments
          var constructorArgs = "";
          if (blockchainBytecodeClean.indexOf(contractBytecodeClean) === 0) {
            constructorArgs = blockchainBytecodeClean.replace(contractBytecodeClean, "");
            blockchainBytecodeClean = blockchainBytecodeClean.replace(constructorArgs, "");
          }

          if (contractBytecodeClean !== blockchainBytecodeClean) {
            var similarity = stringSimilarity.compareTwoStrings(contractBytecodeClean, blockchainBytecodeClean);
            var errorStr = "Unable to verify contract (Similarity: " + similarity + ") \nGot: " + contractBytecodeClean + "\n\nExpected: " + blockchainBytecodeClean;
            callback(errorStr, null);
            return;
          }

          callback(null, {abi: abi, source: contractSource, constructorArgs: constructorArgs, name: contractName });

        });
      }, function(contractData, callback) {
        // Saving contract data
        var db = req.app.get('db');
        db.put(contractAddress, JSON.stringify(contractData), function(err) {
          callback(err);
        });
      }
    ], function(err) {
      if (err) {
        res.render('verifyContract',
          {
            versions,
            message: "Error during contract verification: " + err,
            contractAddress,
            contractName,
            contractSource,
            compilerVersion: compilerVersion.longVersion
          });
      } else {
        res.render('verifyContract', { versions: versions, message: "Contract verification successful." });
      }
    });

  });
});

module.exports = router;
