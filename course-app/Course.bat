@echo off
rem Launch the course as a desktop app.
rem pythonw runs without a console window, so this behaves like a real
rem application: a window opens, and closing it quits everything.

cd /d "%~dp0"

where pythonw >nul 2>nul
if %errorlevel%==0 (
    start "" pythonw desktop.py
) else (
    rem No pythonw on PATH: fall back to python, which keeps a console open.
    start "" python desktop.py
)
