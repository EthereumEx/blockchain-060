const fs = require('fs')
const net = require('net')
const Web3 = require('web3')
const Promise = require('bluebird')
const chalk = require('chalk')

const client = net.Socket()
const web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', client))
const contractPrefix = '<stdin>:'

function unlockAccount (account, password) {
  return new Promise(function (resolve, reject) {
    web3.personal.unlockAccount(account, password, function (err, result) {
      if (err) {
        console.error(chalk.red('Failed to unlock account', account))
        return reject(err)
      }
      console.log('Successfully unlocked account', account)
      resolve()
    })
  })
}

function readContract (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error(chalk.red('Failed to read contract at:', path))
        return reject(err)
      }
      console.log('Read contract at:', path)
      resolve(data)
    })
  })
}

function compileContract (contractName, sourceCode) {
  return new Promise(function (resolve, reject) {
    web3.eth.compile.solidity(sourceCode, function (err, result) {
      if (err) {
        console.error(chalk.red('Failed to compile contract', contractName))
        return reject(err)
      }

      console.log('Successfully compiled contract', contractName)
      const contract = result[contractPrefix + contractName]
      resolve({
        byteCode: contract.code,
        contract: web3.eth.contract(contract.info.abiDefinition)
      })
    })
  })
}

function estimateGas (contract) {
  return new Promise(function (resolve, reject) {
    web3.eth.estimateGas({data: contract.byteCode}, function (err, gas) {
      if (err) {
        console.error(chalk.red('Failed to estimate gas'))
        return reject(err)
      }
      contract.gasEstimate = gas * 2
      console.log('Estimated gas to be:', contract.gasEstimate)
      resolve(contract)
    })
  })
}

function deployContract (contract, creator) {
  var data = {
    from: creator,
    data: contract.byteCode,
    gas: contract.gasEstimate
  }

  return new Promise(function (resolve, reject) {
    contract.contract.new(data, function (err, deployed) {
      if (err) {
        console.error(chalk.red('Failed to deploy contract'))
        return reject(err)
      }

      if (!deployed.address) {
        console.log('Sent transaction with hash:', deployed.transactionHash)
        console.log('Waiting for transaction to be mined')
      } else {
        console.log(chalk.green('Contract mined at address:', deployed.address))
        resolve(deployed)
      }
    })
  })
}

module.exports = {
  unlockAccount: unlockAccount,
  readContract: readContract,
  compileContract: compileContract,
  deployContract: deployContract,
  estimateGas: estimateGas
}
