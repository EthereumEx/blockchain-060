const program = require('commander')
const chalk = require('chalk')
const lib = require('./lib')

const contractPath = '../Contracts/Conference.sol'
const contractName = 'Conference'

function estimateGas (contract) {
  return new Promise(function (resolve, reject) {
    lib.web3.eth.estimateGas({data: contract.byteCode}, function (err, gas) {
      if (err) {
        console.error(chalk.red('Failed to estimate gas'))
        return reject(err)
      }
      contract.gasEstimate = gas * 4
      console.log('Estimated gas to be:', contract.gasEstimate)
      resolve(contract)
    })
  })
}

function deploy (address, quota, fee) {
  return function (contract) {
    var params = {
      from: address,
      data: contract.byteCode,
      gas: contract.gasEstimate
    }
    return new Promise(function (resolve, reject) {
      contract.new(params, function (err, deployed) {
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
}

program
  .usage('<account> [options]')
  .option('-p, --password <s>', 'Password of the account', '')
  .option('-q, --quota <n>', 'Quota for the conference', parseInt, 10)
  .option('-f, --fee <n>', 'Fee to attend the conference', parseInt, 1000)
  .description('Deploy contract')
  .parse(process.argv)

const organizer = program.args.pop()
if (!organizer) {
  lib.handleError('Please specify the organizer\'s account')
}

lib.unlockAccount(organizer, program.password)
  .then(lib.readContract(contractPath))
  .then(lib.compileContract(contractName))
  .then(estimateGas)
  .then(deploy(organizer, program.quota, program.fee))
  .then(lib.done)
.catch(lib.handleError)
