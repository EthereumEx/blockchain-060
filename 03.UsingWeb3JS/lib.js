const fs = require('fs')
const net = require('net')
const Web3 = require('web3')
const Promise = require('bluebird')
const chalk = require('chalk')

const client = net.Socket()
// const web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', client))
const web3 = new Web3(new Web3.providers.IpcProvider('/Users/work/Library/Ethereum/geth.ipc', client))
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
  return function () {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          console.error(chalk.red('Failed to read contract at:', path))
          return reject(err)
        }
        console.log('Read contract at:', path)
        resolve(data)
      })
    })
  }
}

function compileContract (contractName) {
  return function (sourceCode) {
    return new Promise(function (resolve, reject) {
      web3.eth.compile.solidity(sourceCode, function (err, result) {
        if (err) {
          console.error(chalk.red('Failed to compile contract', contractName))
          return reject(err)
        }

        console.log('Successfully compiled contract', contractName)
        var compiled = result[contractPrefix + contractName]
        var contract = web3.eth.contract(compiled.info.abiDefinition)
        contract.byteCode = compiled.code
        resolve(contract)
      })
    })
  }
}

function contractAt (address) {
  return function (contract) {
    return Promise.resolve(contract.at(address))
  }
}

function print (msg) {
  console.log(msg)
  return Promise.resove()
}

function done () {
  console.log('Done')
  process.exit(0)
}

function handleError (err) {
  console.error(chalk.red(err))
  process.exit(-1)
}

module.exports = {
  unlockAccount: unlockAccount,
  readContract: readContract,
  compileContract: compileContract,
  contractAt: contractAt,
  print: print,
  done: done,
  handleError: handleError,
  web3: web3
}
