<#
  run_flutter_check.ps1
  Helper script to detect Flutter on PATH, try a common install path, and show instructions
  Usage: from project root in PowerShell:
    .\run_flutter_check.ps1
#>

function Add-FlutterToPathSession {
    param([string]$flutterBin)
    if (-not (Test-Path $flutterBin)) { return $false }
    $env:Path = "$flutterBin;$env:Path"
    return $true
}

Write-Output "Checking for 'flutter' on PATH..."
$flutterCmd = Get-Command flutter -ErrorAction SilentlyContinue
if ($flutterCmd) {
    Write-Output "Found flutter at: $($flutterCmd.Path)"
    Write-Output "Running 'flutter doctor'..."
    flutter doctor
    exit 0
}

$default = Join-Path $env:USERPROFILE 'src\flutter\bin'
if (Test-Path $default) {
    Write-Output "Flutter not on PATH, but found at: $default"
    Write-Output "Adding to PATH for this session and running 'flutter doctor'..."
    Add-FlutterToPathSession $default | Out-Null
    flutter doctor
    exit 0
}

Write-Output "Flutter executable not found."
Write-Output "Follow these steps to install Flutter on Windows:"
Write-Output "1) Download the latest stable SDK: https://flutter.dev/docs/get-started/install/windows"
Write-Output "2) Extract to a folder, e.g. C:\\src\\flutter"
Write-Output "3) Add the Flutter 'bin' folder to your User PATH and restart the terminal."
Write-Output '   Example (PowerShell):'
Write-Output '     $flutterBin = ''C:\\src\\flutter\\bin''' 
Write-Output '     $current = [Environment]::GetEnvironmentVariable(''Path'',''User'')'
Write-Output '     if (-not $current.Contains($flutterBin)) { [Environment]::SetEnvironmentVariable(''Path'', $current + '';'' + $flutterBin, ''User'') }'
Write-Output '4) Open a new PowerShell and run: flutter doctor'
Write-Output 'Quick temporary session fix (no restart):'
Write-Output '  $env:Path = ''C:\\src\\flutter\\bin;'' + $env:Path'

exit 1
