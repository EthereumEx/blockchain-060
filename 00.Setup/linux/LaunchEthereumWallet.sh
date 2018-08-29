source ./common/common.sh

wallet=""

Invoke-Unpack \
  "EthereumWallet" \
  "https://github.com/ethereum/mist/releases/download/v0.8.9/Ethereum-Wallet-linux64-0-8-9.zip" \
  "0.8.9" \
  "ethereumwallet" \
  wallet \
  Extract-Zip

PATH=$wallet:$PATH

# add geth to the path
pushd "../../.download/"
gethPath="$(realpath $(dirname $(find . -name geth)))"
PATH=$gethPath:$PATH
popd

ethereumwallet
