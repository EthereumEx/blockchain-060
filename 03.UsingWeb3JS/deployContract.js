const chalk = require('chalk')
const util = require('./util')

const contractPath = '../Contracts/Conference.sol'
const contractName = 'Conference'
const me = '0xB82C0ECcf0F5b8c02353358F28662f5AF2567686'
const password = ''

function unlockAccount () {
  return util.unlockAccount(me, password)
}

function readContract () {
  return util.readContract(contractPath)
}

function compileContract (source) {
  return util.compileContract(contractName, source)
}

function estimateGas (contract) {
  return util.estimateGas(contract)
}

function deploy (contract) {
  return util.deployContract(contract, me)
}

function done () {
  console.log('Done')
  process.exit(0)
}

function handleError (err) {
  console.error(chalk.red(err))
  process.exit(-1)
}

unlockAccount()
  .then(readContract)
  .then(compileContract)
  .then(estimateGas)
  .then(deploy)
  .then(done)
.catch(handleError)
