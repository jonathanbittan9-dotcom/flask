# Puts a "Four Tracks" shortcut on your Desktop and in the Start menu, so the
# course launches like any other installed application.
#
#   powershell -ExecutionPolicy Bypass -File tools\install_shortcut.ps1
#
# Removes them again with:  -Uninstall

param([switch]$Uninstall)

$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $PSScriptRoot
$iconPath   = Join-Path $projectDir "static\icon.ico"
$batPath    = Join-Path $projectDir "Course.bat"

$targets = @(
    (Join-Path ([Environment]::GetFolderPath("Desktop")) "Four Tracks.lnk"),
    (Join-Path ([Environment]::GetFolderPath("StartMenu")) "Programs\Four Tracks.lnk")
)

if ($Uninstall) {
    foreach ($t in $targets) {
        if (Test-Path $t) { Remove-Item $t -Force; "removed $t" }
    }
    return
}

if (-not (Test-Path $iconPath)) {
    "icon missing - generating it first"
    python (Join-Path $projectDir "tools\make_icon.py")
}

# This project lives under a path containing Hebrew ("שולחן העבודה"). Assigning
# a non-ASCII TargetPath through PowerShell's COM marshalling fails with
# "Value does not fall within the expected range", so feed WScript.Shell the
# 8.3 short path instead — pure ASCII, and Windows resolves it back to the
# real path when the shortcut is opened.
$fso = New-Object -ComObject Scripting.FileSystemObject

function Get-AsciiPath($path) {
    if ($path -match '^[\x20-\x7E]+$') { return $path }
    if (Test-Path $path -PathType Container) { return $fso.GetFolder($path).ShortPath }
    return $fso.GetFile($path).ShortPath
}

$batShort  = Get-AsciiPath $batPath
$dirShort  = Get-AsciiPath $projectDir
$iconShort = Get-AsciiPath $iconPath

$shell = New-Object -ComObject WScript.Shell

foreach ($t in $targets) {
    $parent = Split-Path -Parent $t
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }

    # Save() cannot write to a path containing Hebrew either, so build the
    # shortcut somewhere ASCII and move it into place with .NET, which can.
    $staging = Join-Path $env:TEMP ("fourtracks-" + [guid]::NewGuid().ToString("N") + ".lnk")

    $lnk = $shell.CreateShortcut($staging)
    $lnk.TargetPath       = $batShort
    $lnk.WorkingDirectory = $dirShort
    $lnk.IconLocation     = "$iconShort,0"
    $lnk.Description      = "Four Tracks to Mastery - Flask, os, JavaScript, CSS"
    $lnk.WindowStyle      = 7          # start minimised; the app window is the UI
    $lnk.Save()

    [System.IO.File]::Copy($staging, $t, $true)
    Remove-Item $staging -Force -ErrorAction SilentlyContinue
    "created $t"
}

"", "Double-click 'Four Tracks' on your Desktop to launch it."
