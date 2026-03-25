@echo off
echo Moviendo accesos directos del escritorio...
echo.

set "pub=C:\Users\Public\Desktop"
set "dest=C:\Users\valen\Documents\Accesos directos"

mkdir "%dest%" 2>nul

move "%pub%\LibreOffice*" "%dest%" >nul 2>&1
move "%pub%\Git Bash*" "%dest%" >nul 2>&1
move "%pub%\Razer Axon*" "%dest%" >nul 2>&1
move "%pub%\7.1 Surround*" "%dest%" >nul 2>&1
move "%pub%\Autofirma*" "%dest%" >nul 2>&1

echo [OK] Listo! Los accesos directos fueron movidos a:
echo      %dest%
echo.
pause
