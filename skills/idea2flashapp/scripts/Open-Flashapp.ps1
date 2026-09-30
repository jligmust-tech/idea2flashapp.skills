<#
.SYNOPSIS
  Open a flashapp (or the gallery) in the default browser.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Open-Flashapp.ps1 -Path flashapps/course-decision/index.html
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Path
)

$ErrorActionPreference = "Stop"
$full = (Resolve-Path -LiteralPath $Path -ErrorAction Stop).Path
Start-Process $full
Write-Output "Opened $full"
