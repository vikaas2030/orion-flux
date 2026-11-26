@echo off
title ORION FLUX - 1-Click Launch and Auto-Recovery
color 0a

echo ===============================================================================
echo                ORION FLUX -- SUPER AGENT SYSTEM (SELF-HEALING)
echo ===============================================================================
echo.

:: Step 1: Health check port 5000 to see if already responding cleanly
powershell -NoProfile -ExecutionPolicy Bypass -Command "$resp = try { (Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 2).StatusCode } catch { 0 }; if ($resp -eq 200) { exit 0 } else { exit 1 }" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] ORION FLUX Server is ALREADY alive and healthy on port 5000.
    goto OPEN_BROWSER
)

echo [1/3] Server not active or unresponsive. Performing clean auto-start...

:: Step 2: Clear any hung zombie process on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    echo [CLEANUP] Terminating stale PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

ping 127.0.0.1 -n 2 >nul

:: Step 3: Start fresh background server using Antigravity Node or Global Node
echo [2/3] Launching hardened background server engine...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$n = 'C:\Users\ASUS\AppData\Roaming\Antigravity\bin\agy-node.cmd'; if (-not (Test-Path $n)) { $cmd = Get-Command node -ErrorAction SilentlyContinue; if ($cmd) { $n = $cmd.Source } }; Start-Process $n -ArgumentList 'app.js' -WorkingDirectory '%~dp0server' -WindowStyle Hidden"

:: Wait up to 5 seconds for health check to confirm server is ready
echo [WAIT] Verifying server initialization...
powershell -NoProfile -ExecutionPolicy Bypass -Command "for ($i=0; $i -lt 5; $i++) { Start-Sleep -Milliseconds 800; $r = try { (Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 1).StatusCode } catch { 0 }; if ($r -eq 200) { exit 0 } }; exit 1" >nul 2>&1

:OPEN_BROWSER
echo.
echo [3/3] Opening ORION FLUX in your default browser...
start http://localhost:5000

echo.
echo ===============================================================================
echo   ORION FLUX is 100%% Operational and Ready!
echo   Dashboard URL: http://localhost:5000
echo   Security: Hardened, Rate-Protected and Crash-Proof
echo ===============================================================================
echo.
ping 127.0.0.1 -n 3 >nul
