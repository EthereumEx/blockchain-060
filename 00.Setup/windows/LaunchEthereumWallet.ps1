
function Invoke-RunWallet
{
    $WalletUri = "https://github.com/ethereum/mist/releases/download/v0.8.9/Ethereum-Wallet-win64-0-8-9.zip"
    $WalletVersion = "0.8.9"

    $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\.."))
    $WalletRoot = (Join-Path $ProjectRoot "wallet")
    $DownloadRoot = (Join-path $ProjectRoot ".download")
    $UnpackedPath = (Join-Path $DownloadRoot "unpacked\wallet\$($WalletVersion)")
    $WalletExe = (Get-ChildItem -Recurse -Path $UnpackedPath "Ethereum Wallet.exe" -ErrorAction SilentlyContinue | Select -First 1).FullName
    
    if (!$WalletExe -or !(Test-Path $WalletExe))
    {
        $WalletZip = (Join-Path $DownloadRoot "wallet.zip")
        "Downloading Etherum Wallet $($WalletVersion) to $($WalletZip)" | Write-Header

        if (!(Test-Path $WalletZip))
        {
            New-Item -Type Directory -Path (Split-Path $WalletZip) -Force | Out-Null 
            Invoke-WebRequest -Uri $WalletUri -OutFile $WalletZip
        }

        if (Test-Path $UnpackedPath)
        {
            Remove-Item -Recurse -Force $UnpackedPath
        }

        "Extracting $WalletExe" | Write-Host
        Expand-ZIPFile $WalletZip $UnpackedPath
        $WalletExe = (Get-ChildItem -Recurse -Path $UnpackedPath "Ethereum Wallet.exe" | Select -First 1).FullName
    }

    . $WalletExe
}

function Write-Header
{
    param(
        [Parameter(mandatory=$true,valueFromPipeline=$true)]
        $Message
    )

    "" | Write-Host        
    "------------------------------------------------------------------" | Write-Host
    $Message | Write-Host
    "------------------------------------------------------------------" | Write-Host
}

function Expand-ZIPFile($file, $destination)
{
    $shell = new-object -com shell.application
    $zip = $shell.NameSpace($file)

    if (!(Test-Path $destination))
    {
        "Creating directory $destination" | Write-Host
        New-Item -Type Directory -Path $destination | Out-Null
    }

    $output = $shell.NameSpace($destination)
    foreach($item in $zip.items())
    {
        $output.copyhere($item)
    }
}

Invoke-RunWallet