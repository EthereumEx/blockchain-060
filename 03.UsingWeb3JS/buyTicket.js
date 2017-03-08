const Promise = require('bluebird')
const program = require('commander')
const chalk = require('chalk')
const lib = require('./lib')

const contractPath = '../Contracts/Conference.sol'
const contractName = 'Conference'

function getNumRegistrants (contract) {
  return new Promise(function (resolve, reject) {
    contract.Registrants(function (err, result) {
      if (err) {
        console.log(chalk.red('Failed to get quota'))
        return reject(err)
      }
      console.log(chalk.green('Number of registrants: ', result.toString()))
      resolve(contract)
    })
  })
}

function wait (contract) {
  console.log('Waiting for transaction to be mined...')
  return new Promise(function (resolve, reject) {
    var interval = setInterval(function () {
      lib.web3.eth.getTransactionReceipt(contract.hash, function (err, res) {
        if (err) {
          clearInterval(interval)
          return reject(err)
        }

        if (res) {
          clearInterval(interval)
          resolve(contract.contract)
        }
      })
    }, 2000)
  })
}

function getQuota (contract) {
  return new Promise(function (resolve, reject) {
    contract.GetQuota(function (err, result) {
      if (err) {
        console.log(chalk.red('Failed to get quota'))
        return reject(err)
      }
      console.log(chalk.green('Quota on this contract is: ', result.toString()))
      resolve(contract)
    })
  })
}

function buy (account, fee) {
  return function (contract) {
    var data = {
      value: fee,
      from: account,
      gas: 100000
    }

    console.log('Booking ticket with value:', data.value)
    return new Promise(function (resolve, reject) {
      contract.BuyTicket(data, function (err, result) {
        if (err) {
          console.log(chalk.red('Failed to buy ticker'))
          return reject(err)
        }
        console.log('Transaction sent with hash:', result)
        resolve({
          contract: contract,
          hash: result
        })
      })
    })
  }
}

program
  .option('-c, --contract <s>', 'Address of the conference contract')
  .option('-b, --buyer <s>', 'Address of the buyer account')
  .option('-p, --password <s>', 'Password of the account', '')
  .option('-f, --fee <n>', 'Booking fee', parseInt, 1000)
  .description('Book a ticket')
  .parse(process.argv)

if (!program.contract) {
  lib.handleError('Please specify the conference contract address')
}

if (!program.buyer) {
  lib.handleError('Please specify the buyer\'s account address')
}

lib.unlockAccount(program.buyer, program.password)
  .then(lib.readContract(contractPath))
  .then(lib.compileContract(contractName))
  .then(lib.contractAt(program.contract))
  .then(getQuota)
  .then(getNumRegistrants)
  .then(buy(program.buyer, program.fee))
  .then(wait)
  .then(getNumRegistrants)
  .then(lib.done)
.catch(lib.handleError)
