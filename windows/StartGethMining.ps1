
function Invoke-RunGeth
{
    $GethRoot = (Join-Path $PSScriptRoot "..\geth")
    $DownloadRoot = (Join-path $PSScriptRoot "..\.download")
    $GethExe = (Join-Path $GethRoot "geth.exe")

    if (!(Test-Path $GethExe))
    {
        "Downloading Geth 1.5.7 to $($GethExe)" | Write-Host
        $GethZip = (Join-Path $DownloadRoot "geth.zip")

        if (!(Test-Path $GethZip))
        {
            Invoke-WebRequest -Uri "https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.5.7-da2a22c3.zip" -OutFile $GethZip
        }

        $UnpackedPath = (Join-Path $DownloadRoot "unpacked\1.5.7")

        if (Test-Path $UnpackedPath)
        {
            Remove-Item -Recurse -Force $UnpackedPath
        }

        Expand-ZIPFile $GethZip $UnpackedPath
        $UnpackedGeth = (Get-ChildItem -Recurse -Path $UnpackedPath "geth.exe" | Select -First 1).FullName
        Copy-Item -Force $UnpackedGeth $GethExe
        "" | Write-Host
    }

    $ChainData = (Join-Path $GethRoot "geth\chaindata")
    $GethData = (Join-Path $GethRoot "data")
    
    if (!(Test-Path $ChainData))
    {
        $GenesisPath = (Join-Path $GethRoot "genesis.json")
        "Initialize Geth genesis block from $($GenesisPath)" | Write-Host
        "$GethExe --datadir $($GethData) init $($GenesisPath)" | Write-Verbose 
        . $GethExe --datadir $GethData init $GenesisPath
        "" | Write-Host        
    }
    
    "Launching Geth with mining enabled" | Write-Host
    "$GethExe --datadir $GethData --mine --minerthreads 2 --networkid 54321" | Write-Verbose
    . $GethExe --datadir $GethData --mine --minerthreads 2 --networkid 54321
}

function Expand-ZIPFile($file, $destination)
{
    $shell = new-object -com shell.application
    $zip = $shell.NameSpace($file)

    if (!(Test-Path $destination))
    {
        New-Item -Type Directory -Path $destination | Out-Null
    }

    $output = $shell.NameSpace($destination)
    foreach($item in $zip.items())
    {
        $output.copyhere($item)
    }
}

Invoke-RunGeth