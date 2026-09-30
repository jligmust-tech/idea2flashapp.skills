<#
.SYNOPSIS
  Scaffold a new flashapp from the idea2flashapp template.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/New-Flashapp.ps1 -Slug course-decision -Title "Course Decision" -Purpose "Should I enroll?"
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Slug,
  [Parameter(Mandatory=$true)][string]$Title,
  [string]$Purpose = "A single-file app that applies this idea.",
  [string]$OutDir = (Join-Path (Get-Location) "flashapps"),
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$template = Join-Path $PSScriptRoot "..\assets\template.html" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $template) { throw "Template not found at assets/template.html" }
$template = $template.Path

# normalise slug (strip accents, then keep [a-z0-9-])
function ConvertTo-Slug([string]$s) {
  $n  = $s.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object Text.StringBuilder
  foreach ($ch in $n.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$sb.Append($ch)
    }
  }
  return ($sb.ToString().ToLower() -replace '[^a-z0-9]+','-').Trim('-')
}
$Slug = ConvertTo-Slug $Slug
if ([string]::IsNullOrWhiteSpace($Slug)) { throw "Slug is empty after normalisation." }

$appDir  = Join-Path $OutDir $Slug
$appFile = Join-Path $appDir "index.html"

if ((Test-Path $appFile) -and -not $Force) {
  throw "Already exists: $appFile  (use -Force to overwrite)"
}
if (-not (Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir -Force | Out-Null }

$html = Get-Content -LiteralPath $template -Raw -Encoding UTF8
$html = $html.Replace('{{TITLE}}',   $Title)
$html = $html.Replace('{{PURPOSE}}', $Purpose)
$html = $html.Replace('{{SLUG}}',    $Slug)

Set-Content -LiteralPath $appFile -Value $html -Encoding UTF8

Write-Output $appFile
