function Invoke-Unpack
{
  local name=$1
  local uri=$2
  local version=$3
  local fileName=$4
  local fileNamePathVar=$5
  local extractFunc=$6
  local downloadDir="../../.download/"
  local extractDir="unpacked/$name/$version/"
  local extractFile="$name.$version.comp"

  mkdir $downloadDir
  pushd $downloadDir

  local filePath="$(realpath $(dirname $(find . -name $fileName)))"

  # If the file already exists, use it. Else, download.
  if [ ! -z "$filePath" ]; then
    eval "$fileNamePathVar=$filePath"
  else
    # download
    wget -O $extractFile $uri

    # create extraction dir
    mkdir -p "$extractDir"

    # invoke extraction function
    eval "$extractFunc ./$extractFile '$extractDir'"

    # delete archive file
    rm -r ./$extractFile

    # find the file we're looking for, and get its parent folder, fully resolved
    local filePath="$(realpath $(dirname $(find . -name $fileName)))"

    # set the path var for the caller
    eval "$fileNamePathVar=$filePath"
  fi

  popd
}

function Extract-Zip
{
  local fileName=$1
  local extractDirectory=$2

  unzip $fileName -d $extractDirectory
}

function Extract-TarGz
{
  local fileName=$1
  local extractDirectory=$2

  tar -xzvf $fileName -C $extractDirectory
}
