param(
    [Switch]
    $DisableMining,
    [String]
    $NetworkId = "54321",
    [String]
    $EnodeUrl
)    

Set-StrictMode -Version 2

Import-Module (Join-Path $PSScriptRoot "Common") -Force

$config = [PSCustomObject]@{
    Name = "Solidity";
    Uri = "https://github.com/ethereum/solidity/releases/download/v0.4.9/solidity-windows.zip";
    Version = "0.4.9"
}

$directory = $config | Invoke-Unpack
$SolcPath = (Get-ChildItem -Recurse -Path $directory "solc.exe" | Select -First 1).Directory
$env:Path += ";$SolcPath"

$config = [PSCustomObject]@{
    Name = "GoEthereum";
    Uri = "https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.5.7-da2a22c3.zip";
    Version = "1.5.7"
}

$directory = $config | Invoke-Unpack
$GethExe = (Get-ChildItem -Recurse -Path $directory "geth.exe" | Select -First 1).FullName

$LessonRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\01.LocalBlockchain"))
$GethData = (Join-Path $LessonRoot "data")
$ChainData = (Join-Path $GethData "geth\chaindata")

if (!(Test-Path $ChainData))
{
    $GenesisPath = (Join-Path $LessonRoot "genesis.json")
    "Initialize Geth genesis block from $($GenesisPath)" | Write-Header
    "$GethExe --datadir $($GethData) init $($GenesisPath)" | Write-Verbose 
    . $GethExe --datadir $GethData init $GenesisPath
}

if ($EnodeUrl)
{
    "Reading enode list" | Write-Host
    $Enodes = (Invoke-WebRequest -Uri $EnodeUrl -UseBasicParsing).Content
    $StaticEnodes = (Join-Path $GethData "static-nodes.json")
    "Writing static-nodes.json" | Write-Host
    $Enodes | Out-File -FilePath $StaticEnodes -Force
}

if ($DisableMining)
{
    "Launching Geth in TX mode" | Write-Header
    "$GethExe --datadir $GethData --networkid $NetworkId" | Write-Verbose
    . $GethExe --datadir $GethData --networkid $NetworkId
}
else 
{
    "Launching Geth with mining enabled" | Write-Header
    "$GethExe --datadir $GethData --mine --minerthreads 2 --networkid $NetworkId" | Write-Verbose
    . $GethExe --datadir $GethData --mine --minerthreads 2 --networkid $NetworkId
}
