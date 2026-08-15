@echo off
setlocal
cd /d "%~dp0"

set "PORT=8000"
if not "%~1"=="" set "PORT=%~1"

set "PYTHON="
where python >nul 2>nul
if not errorlevel 1 (
  set "PYTHON=python"
) else (
  where py >nul 2>nul
  if not errorlevel 1 set "PYTHON=py -3"
)

if not defined PYTHON (
  echo Python 3 is required to run the demo.
  echo Install it from https://www.python.org/downloads/
  pause
  exit /b 1
)

echo Starting romanjo-art-qa at http://127.0.0.1:%PORT%/
start "romanjo-art-qa" %PYTHON% -m http.server %PORT% --directory "%~dp0."
timeout /t 2 /nobreak >nul
start "romanjo-art-qa" "http://127.0.0.1:%PORT%/"

endlocal
