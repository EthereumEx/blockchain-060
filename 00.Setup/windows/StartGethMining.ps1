
function Invoke-RunGeth
{
    $GethUri = "https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.5.7-da2a22c3.zip"
    $GethVersion = "1.5.7"

    $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\.."))
    $GethRoot = (Join-Path $ProjectRoot "01.LocalBlockchain\geth")
    $DownloadRoot = (Join-path $ProjectRoot ".download")
    $GethExe = (Join-Path $GethRoot "geth.exe")

    if (!(Test-Path $GethExe))
    {
        $GethZip = (Join-Path $DownloadRoot "geth.zip")
        "Downloading Geth $($GethVersion) to $($GethZip)" | Write-Header

        if (!(Test-Path $GethZip))
        {
            New-Item -Type Directory -Path (Split-Path $GethZip) -Force | Out-Null 
            Invoke-WebRequest -Uri $GethUri -OutFile $GethZip
        }

        $UnpackedPath = (Join-Path $DownloadRoot "unpacked\geth\$($GethVersion)")

        if (Test-Path $UnpackedPath)
        {
            Remove-Item -Recurse -Force $UnpackedPath
        }

        "Extracting $GethExe" | Write-Host
        Expand-ZIPFile $GethZip $UnpackedPath
        $UnpackedGeth = (Get-ChildItem -Recurse -Path $UnpackedPath "geth.exe" | Select -First 1).FullName
        Copy-Item -Force $UnpackedGeth $GethExe
    }

    $ChainData = (Join-Path $GethRoot "geth\chaindata")
    $GethData = (Join-Path $GethRoot "data")
    
    if (!(Test-Path $ChainData))
    {
        $GenesisPath = (Join-Path $GethRoot "genesis.json")
        "Initialize Geth genesis block from $($GenesisPath)" | Write-Header
        "$GethExe --datadir $($GethData) init $($GenesisPath)" | Write-Verbose 
        . $GethExe --datadir $GethData init $GenesisPath
    }
    
    "Launching Geth with mining enabled" | Write-Header
    "$GethExe --datadir $GethData --mine --minerthreads 2 --networkid 54321" | Write-Verbose
    . $GethExe --datadir $GethData --mine --minerthreads 2 --networkid 54321
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

Invoke-RunGeth