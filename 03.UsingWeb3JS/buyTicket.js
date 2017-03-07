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

function wait (hash) {
  return new Promise(function (resolve, reject) {
    lib.web3.eth.filter('latest', function (err, result) {
      if (err) {
        console.error(err)
        return reject(err)
      }

      console.log(result)
      resolve(result)
    })
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

function buy (account, price) {
  return function (contract) {
    var data = {
      value: price,
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
        resolve(contract)
      })
    })
  }
}

function buyTicket (address, price, account, password) {
  password = password || ''
  lib.unlockAccount(account, password)
    .then(lib.readContract(contractPath))
    .then(lib.compileContract(contractName))
    .then(lib.contractAt(address))
    .then(getQuota)
    .then(getNumRegistrants)
    .then(buy(account, price))
    .then(getNumRegistrants)
    .then(lib.done)
  .catch(lib.handleError)
}

program
  .arguments('address account price')
  .option('-p', '--password', 'Password of the account')
  .description('Deploy contract')
  .action(buyTicket)
  .parse(process.argv)
