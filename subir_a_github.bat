@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0subir_a_github.ps1"
pause
