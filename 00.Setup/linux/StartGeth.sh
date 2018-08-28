source ./common/common.sh

function Print-Help
{
  echo "***********************************************"
  echo "Package Requirements: wget, unzip, tar, realpath"
  echo "Arguments:"
  echo "  -d -> Disable Mining"
  echo "  -n 1234 -> Network Id"
  echo "  -e \"enode://...\" -> Enode Url"
  echo "***********************************************"
}

# Process arguments (-h, -d, -n 123, -e enode://...)
disableMining=0
networkId="54321"
eNodeUrl=""

while getopts "hdn:e:" opt; do
  case ${opt} in
    h )
      Print-Help
      exit 0
      ;;
    d )
      disableMining=1
      ;;
    n )
      networkId="$OPTARG"
      ;;
    e )
      eNodeUrl="$OPTARG"
      ;;
    \? )
      exit 1
      ;;
  esac
done
shift $((OPTIND -1))

# Download solidity compiler & add to path
solcPath=""

Invoke-Unpack \
  "Solidity" \
  "https://github.com/ethereum/solidity/releases/download/v0.4.9/solidity-ubuntu-trusty.zip" \
  "0.4.9" \
  "solc" \
  solcPath \
  Extract-Zip

PATH=$solcPath:$PATH

# Download Go Ethereum & add to path
gethPath=""

Invoke-Unpack \
  "GoEthereum" \
  "https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.5.7-da2a22c3.tar.gz" \
  "1.5.7" \
  "geth" \
  gethPath \
  Extract-TarGz

PATH=$gethPath:$PATH

# Initialize geth from the genesis block if not done before
lessonRoot=$(realpath "../../01.LocalBlockchain")
dataRoot=$lessonRoot"/data"
chainDataRoot=$dataRoot"/geth/chaindata"

if [ ! -d "$chainDataRoot" ]; then
  genesisPath=$lessonRoot"/genesis.json"
  geth --datadir $chainDataRoot init $genesisPath
fi

# If the eNode URL option is set, create the static-nodes.json file
if [ ! -z "$eNodeUrl" ]; then
  eNodeJson=$(wget $eNodeUrl -O -)
  staticNodesFile=$dataRoot"/static-nodes.json"
  rm -r "$staticNodesFile"
  touch "$staticNodesFile"
  echo "$eNodeJson" > "$staticNodesFile"
fi

# If mining is disabled
if [ "$disableMining" -eq "1" ]; then
  # Launch Geth in TX mode
  geth --datadir $dataRoot --networkid $networkId
else
  # Launch Geth with mining enabled
  geth --datadir $dataRoot --mine --minerthreads 1 --networkid $networkId
fi
