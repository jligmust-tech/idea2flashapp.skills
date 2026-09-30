<#
.SYNOPSIS
  Register a built flashapp: updates registry.json, regenerates the gallery,
  and opens the app.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Register-Flashapp.ps1 `
      -Path flashapps/course-decision/index.html `
      -Title "Course Decision" -Slug course-decision `
      -Archetype decision -Source "blog: How to decide on a course"
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Path,
  [Parameter(Mandatory=$true)][string]$Title,
  [Parameter(Mandatory=$true)][string]$Slug,
  [string]$Archetype = "custom",
  [string]$Source = "user idea",
  [string]$FlashappsDir = (Join-Path (Get-Location) "flashapps"),
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

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

$appFile = (Resolve-Path -LiteralPath $Path -ErrorAction Stop).Path
$Slug    = ConvertTo-Slug $Slug
$rel     = "$Slug/index.html"

if (-not (Test-Path $FlashappsDir)) { New-Item -ItemType Directory -Path $FlashappsDir -Force | Out-Null }
$registryPath = Join-Path $FlashappsDir "registry.json"

$apps = @()
if (Test-Path $registryPath) {
  try {
    $reg  = Get-Content -LiteralPath $registryPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($reg.apps) { $apps = @($reg.apps) }
  } catch { $apps = @() }
}

$apps = @($apps | Where-Object { $_.slug -ne $Slug })
$apps += [pscustomobject]@{
  slug      = $Slug
  title     = $Title
  archetype = $Archetype
  source    = $Source
  path      = $rel
  updatedAt = (Get-Date).ToString("s")
}

$out = [pscustomobject]@{
  updatedAt = (Get-Date).ToString("s")
  apps      = $apps
}
$out | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $registryPath -Encoding UTF8

# ---- regenerate gallery -------------------------------------------------
function Esc([string]$s){ $s -replace '&','&amp;' -replace '<','&lt;' -replace '>','&gt;' -replace '"','&quot;' }

$cards = foreach ($a in ($apps | Sort-Object title)) {
  @"
    <a class="card" href="$(Esc $a.path)">
      <span class="tag">$(Esc $a.archetype)</span>
      <h3>$(Esc $a.title)</h3>
      <p class="meta">$(Esc $a.source)</p>
    </a>
"@
}

$gallery = @"
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light"><title>Flashapps</title>
<style>
 :root{--bg:#0f1115;--surface:#171a21;--border:#262b36;--text:#e8eaed;--muted:#9aa4b2;--accent:#5b8cff}
 @media (prefers-color-scheme:light){:root{--bg:#f5f6f8;--surface:#fff;--border:#e2e5ea;--text:#14171c;--muted:#5b6472}}
 *{box-sizing:border-box}
 body{margin:0;padding:32px 16px 64px;background:var(--bg);color:var(--text);
      font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
 .wrap{max-width:900px;margin:0 auto}
 h1{margin:0 0 4px;font-size:1.6rem}
 .sub{color:var(--muted);margin:0 0 28px}
 .grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
 .card{display:block;background:var(--surface);border:1px solid var(--border);
       border-radius:14px;padding:18px;text-decoration:none;color:inherit;transition:border-color .15s}
 .card:hover{border-color:var(--accent)}
 .card h3{margin:8px 0 6px;font-size:1.05rem}
 .meta{margin:0;color:var(--muted);font-size:.85rem}
 .tag{display:inline-block;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;
      color:var(--accent);border:1px solid var(--border);border-radius:999px;padding:2px 8px}
 .empty{color:var(--muted)}
</style></head>
<body><div class="wrap">
 <h1>Flashapps</h1>
 <p class="sub">$(($apps | Measure-Object).Count) app(s) generated from ideas.</p>
 <div class="grid">
$cards
 </div>
</div></body></html>
"@
Set-Content -LiteralPath (Join-Path $FlashappsDir "index.html") -Value $gallery -Encoding UTF8

Write-Output "Registered '$Title' -> $rel"
Write-Output "Gallery: $(Join-Path $FlashappsDir 'index.html')"

if (-not $NoOpen) { Start-Process $appFile }
