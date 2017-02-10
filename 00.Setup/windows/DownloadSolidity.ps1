Set-StrictMode -Version 2

Import-Module (Join-Path $PSScriptRoot "Common") -Force

$config = [PSCustomObject]@{
    Name = "Solidity";
    Uri = "https://github.com/ethereum/solidity/releases/download/v0.4.9/solidity-windows.zip";
    Version = "0.4.9"
}

$directory = $config | Invoke-Unpack
(Get-ChildItem -Recurse -Path $directory "solc.exe" | Select -First 1).FullName