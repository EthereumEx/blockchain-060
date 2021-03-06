Set-StrictMode -Version 2

function Invoke-Unpack
{
    param(
        [Parameter(mandatory=$true,ValueFromPipelineByPropertyName=$true)]
        $Name,
        [Parameter(mandatory=$true,ValueFromPipelineByPropertyName=$true)]
        $Uri,
        [Parameter(mandatory=$true,ValueFromPipelineByPropertyName=$true)]
        $Version,
        [Parameter(mandatory=$true,ValueFromPipeline=$true)]
        $Pipeline
    )
    $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.."))
    $DownloadRoot = (Join-path $ProjectRoot ".download")
    $UnpackedPath = (Join-Path $DownloadRoot "unpacked\$($Name)\$($Version)")

    $ZipDownload = (Join-Path $DownloadRoot "$($name).$($version).zip")

    if (!(Test-Path $UnpackedPath))
    {
        if (!(Test-Path $ZipDownload))
        {
            "Downloading $Name $($Version) to $($ZipDownload)" | Write-Header
            New-Item -Type Directory -Path (Split-Path $ZipDownload) -Force | Out-Null 
            Invoke-WebRequest -Uri $Uri -OutFile $ZipDownload
        }

        "Extracting $ZipDownload" | Write-Host
        Expand-ZIPFile $ZipDownload $UnpackedPath
    }

    
    $UnpackedPath
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