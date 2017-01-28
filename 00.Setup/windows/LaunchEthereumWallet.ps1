
Set-StrictMode -Version 2

Import-Module (Join-Path $PSScriptRoot "Common") -Force

$config = [PSCustomObject]@{
    Name = "EthereumWallet";
    Uri = "https://github.com/ethereum/mist/releases/download/v0.8.9/Ethereum-Wallet-win64-0-8-9.zip";
    Version = "0.8.9"
}

$directory = $config | Invoke-Unpack
$WaletExe = (Get-ChildItem -Recurse -Path $directory "Ethereum Wallet.exe" | Select -First 1).FullName
. $WaletExe