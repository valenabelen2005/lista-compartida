# ============================================================
#  OptimizarPC.ps1 — Optimizacion completa de Windows
#  Ejecutar como Administrador
# ============================================================

$Host.UI.RawUI.WindowTitle = "Optimizacion de PC - Por favor espera..."

# Verificar que se ejecuta como Administrador
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host ""
    Write-Host "  [!] Este script necesita permisos de Administrador." -ForegroundColor Red
    Write-Host "      Haz clic derecho en el archivo y selecciona 'Ejecutar como administrador'." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# ---- Colores y formato ----
function Write-Title($text) {
    Write-Host ""
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host "   $text" -ForegroundColor Cyan
    Write-Host "  ============================================" -ForegroundColor Cyan
}

function Write-Step($text) {
    Write-Host "  >> $text" -ForegroundColor Yellow
}

function Write-OK($text) {
    Write-Host "  [OK] $text" -ForegroundColor Green
}

function Write-Info($text) {
    Write-Host "  [-] $text" -ForegroundColor Gray
}

# ---- Calcular espacio inicial ----
$drive = (Get-Location).Drive.Name + ":"
$spaceBefore = (Get-PSDrive -Name ($drive -replace ':','') | Select-Object -ExpandProperty Free)

Clear-Host
Write-Host ""
Write-Host "  ██████╗ ██████╗ ████████╗██╗███╗   ███╗██╗███████╗ █████╗ ██████╗" -ForegroundColor Cyan
Write-Host "  ██╔═══██╗██╔══██╗╚══██╔══╝██║████╗ ████║██║╚══███╔╝██╔══██╗██╔══██╗" -ForegroundColor Cyan
Write-Host "  ██║   ██║██████╔╝   ██║   ██║██╔████╔██║██║  ███╔╝ ███████║██████╔╝" -ForegroundColor Cyan
Write-Host "  ██║   ██║██╔═══╝    ██║   ██║██║╚██╔╝██║██║ ███╔╝  ██╔══██║██╔══██╗" -ForegroundColor Cyan
Write-Host "  ╚██████╔╝██║        ██║   ██║██║ ╚═╝ ██║██║███████╗██║  ██║██║  ██║" -ForegroundColor Cyan
Write-Host "   ╚═════╝ ╚═╝        ╚═╝   ╚═╝╚═╝     ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "                     Optimizacion de PC — Windows" -ForegroundColor White
Write-Host "            Limpieza de disco | Velocidad | Privacidad" -ForegroundColor Gray
Write-Host ""
Write-Host "  Espacio libre actual: $([math]::Round($spaceBefore/1GB, 2)) GB" -ForegroundColor White
Write-Host ""
Start-Sleep -Seconds 2


# ============================================================
#  1. ARCHIVOS TEMPORALES DEL SISTEMA
# ============================================================
Write-Title "1/8 - Archivos temporales del sistema"

$tempFolders = @(
    $env:TEMP,
    $env:TMP,
    "C:\Windows\Temp",
    "C:\Windows\Prefetch",
    "$env:LOCALAPPDATA\Temp"
)

foreach ($folder in $tempFolders) {
    if (Test-Path $folder) {
        Write-Step "Limpiando: $folder"
        try {
            Get-ChildItem -Path $folder -Recurse -Force -ErrorAction SilentlyContinue |
                Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
            Write-OK "Limpiado: $folder"
        } catch {
            Write-Info "Algunos archivos en uso no pudieron eliminarse (normal)"
        }
    }
}


# ============================================================
#  2. PAPELERA DE RECICLAJE
# ============================================================
Write-Title "2/8 - Papelera de reciclaje"
Write-Step "Vaciando papelera..."
try {
    Clear-RecycleBin -Force -ErrorAction SilentlyContinue
    Write-OK "Papelera vaciada"
} catch {
    Write-Info "La papelera ya estaba vacia"
}


# ============================================================
#  3. CACHE DE WINDOWS UPDATE
# ============================================================
Write-Title "3/8 - Cache de Windows Update"
Write-Step "Deteniendo servicio de Windows Update..."
Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
Stop-Service -Name bits -Force -ErrorAction SilentlyContinue

$wuCache = "C:\Windows\SoftwareDistribution\Download"
if (Test-Path $wuCache) {
    Write-Step "Eliminando cache de actualizaciones..."
    try {
        Remove-Item -Path "$wuCache\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-OK "Cache de Windows Update eliminada"
    } catch {
        Write-Info "Algunos archivos no pudieron eliminarse"
    }
}

Write-Step "Reiniciando servicio de Windows Update..."
Start-Service -Name wuauserv -ErrorAction SilentlyContinue
Start-Service -Name bits -ErrorAction SilentlyContinue
Write-OK "Servicios reiniciados"


# ============================================================
#  4. CACHE DE NAVEGADORES
# ============================================================
Write-Title "4/8 - Cache de navegadores (Chrome, Edge, Firefox)"

# Google Chrome
$chromePaths = @(
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache\Cache_Data",
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache",
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\GPUCache",
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Service Worker\CacheStorage"
)
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        Write-Step "Chrome: $($path.Split('\')[-1])"
        Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-OK "Cache de Chrome limpiada"

# Microsoft Edge
$edgePaths = @(
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache\Cache_Data",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\GPUCache"
)
foreach ($path in $edgePaths) {
    if (Test-Path $path) {
        Write-Step "Edge: $($path.Split('\')[-1])"
        Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-OK "Cache de Edge limpiada"

# Mozilla Firefox
$firefoxProfile = "$env:APPDATA\Mozilla\Firefox\Profiles"
if (Test-Path $firefoxProfile) {
    Get-ChildItem -Path $firefoxProfile -Directory | ForEach-Object {
        $ffCache = Join-Path $_.FullName "cache2"
        if (Test-Path $ffCache) {
            Write-Step "Firefox: cache2"
            Remove-Item -Path "$ffCache\*" -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    Write-OK "Cache de Firefox limpiada"
}


# ============================================================
#  5. MINIATURAS Y CACHE DEL SISTEMA
# ============================================================
Write-Title "5/8 - Miniaturas e iconos en cache"

Write-Step "Eliminando cache de miniaturas..."
$thumbPath = "$env:LOCALAPPDATA\Microsoft\Windows\Explorer"
if (Test-Path $thumbPath) {
    Get-ChildItem -Path $thumbPath -Filter "thumbcache_*.db" -Force -ErrorAction SilentlyContinue |
        Remove-Item -Force -ErrorAction SilentlyContinue
    Write-OK "Cache de miniaturas eliminada"
}

Write-Step "Limpiando historial de busquedas de Windows..."
Remove-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\WordWheelQuery" -Recurse -Force -ErrorAction SilentlyContinue
Write-OK "Historial de busquedas limpiado"

Write-Step "Limpiando lista de archivos recientes..."
$recentPath = "$env:APPDATA\Microsoft\Windows\Recent"
if (Test-Path $recentPath) {
    Remove-Item -Path "$recentPath\*" -Recurse -Force -ErrorAction SilentlyContinue
}
Write-OK "Archivos recientes limpiados"


# ============================================================
#  6. DNS Y RED
# ============================================================
Write-Title "6/8 - Cache de DNS y red"
Write-Step "Limpiando cache DNS..."
ipconfig /flushdns | Out-Null
Write-OK "Cache DNS limpiada"

Write-Step "Reiniciando Winsock (red)..."
netsh winsock reset | Out-Null
Write-OK "Winsock reiniciado (requiere reinicio para aplicar)"


# ============================================================
#  7. OPTIMIZAR INICIO DE WINDOWS
# ============================================================
Write-Title "7/8 - Optimizacion de velocidad de inicio"

Write-Step "Deshabilitando efectos visuales innecesarios..."
$perfKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects"
if (-not (Test-Path $perfKey)) { New-Item -Path $perfKey -Force | Out-Null }
Set-ItemProperty -Path $perfKey -Name "VisualFXSetting" -Value 2 -ErrorAction SilentlyContinue
Write-OK "Efectos visuales ajustados para mejor rendimiento"

Write-Step "Ajustando plan de energia a Alto Rendimiento..."
powercfg /setactive SCHEME_MIN 2>$null
if ($LASTEXITCODE -ne 0) {
    # Si no existe el plan, buscar el de Alto Rendimiento disponible
    $highPerf = powercfg /list | Select-String "Alto rendimiento|High performance" | Select-Object -First 1
    if ($highPerf) {
        $guid = ($highPerf -split '\s+')[3]
        powercfg /setactive $guid 2>$null
    }
}
Write-OK "Plan de energia configurado"

Write-Step "Verificando programas de inicio (listando los activos)..."
Write-Host ""
Write-Host "  Programas que se inician con Windows:" -ForegroundColor White
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command | ForEach-Object {
    Write-Host "    - $($_.Name)" -ForegroundColor Gray
}
Write-Host ""
Write-Info "Para deshabilitar alguno: Ctrl+Shift+Esc > Inicio > Clic derecho > Deshabilitar"


# ============================================================
#  8. LIMPIEZA DE DISCO DE WINDOWS
# ============================================================
Write-Title "8/8 - Limpieza de disco de Windows (cleanmgr)"
Write-Step "Ejecutando limpieza automatica del sistema..."

# Configurar cleanmgr para limpiar todo automaticamente
$sageset = 65535
$regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches"
$keys = @(
    "Active Setup Temp Folders", "BranchCache", "Downloaded Program Files",
    "GameNewsFiles", "GameStatisticsFiles", "GameUpdateFiles",
    "Internet Cache Files", "Memory Dump Files", "Offline Pages Files",
    "Old ChkDsk Files", "Previous Installations", "Recycle Bin",
    "Service Pack Cleanup", "Setup Log Files", "System error memory dump files",
    "System error minidump files", "Temporary Files", "Temporary Setup Files",
    "Thumbnail Cache", "Update Cleanup", "Upgrade Discarded Files",
    "User file versions", "Windows Defender", "Windows Error Reporting Archive Files",
    "Windows Error Reporting Queue Files", "Windows Error Reporting System Archive Files",
    "Windows Error Reporting System Queue Files", "Windows ESD installation files",
    "Windows Upgrade Log Files"
)

foreach ($key in $keys) {
    $fullPath = "$regPath\$key"
    if (Test-Path $fullPath) {
        Set-ItemProperty -Path $fullPath -Name "StateFlags$sageset" -Value 2 -ErrorAction SilentlyContinue
    }
}

Start-Process -FilePath cleanmgr.exe -ArgumentList "/sagerun:$sageset" -Wait -ErrorAction SilentlyContinue
Write-OK "Limpieza de disco completada"


# ============================================================
#  RESUMEN FINAL
# ============================================================
$spaceAfter = (Get-PSDrive -Name ($drive -replace ':','') | Select-Object -ExpandProperty Free)
$freed = [math]::Round(($spaceAfter - $spaceBefore) / 1MB, 0)

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Green
Write-Host "   OPTIMIZACION COMPLETADA" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Espacio antes:   $([math]::Round($spaceBefore/1GB, 2)) GB libres" -ForegroundColor White
Write-Host "  Espacio despues: $([math]::Round($spaceAfter/1GB, 2)) GB libres" -ForegroundColor White
if ($freed -gt 0) {
    Write-Host "  Liberado:        +$freed MB" -ForegroundColor Green
} else {
    Write-Host "  Nota: El espacio liberado ya fue reutilizado por el sistema" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "  Proximos pasos recomendados:" -ForegroundColor Cyan
Write-Host "   1. Reinicia la PC para aplicar todos los cambios" -ForegroundColor White
Write-Host "   2. Ve a Inicio > Configuracion > Aplicaciones y desinstala lo que no uses" -ForegroundColor White
Write-Host "   3. Usa el Administrador de tareas (Ctrl+Shift+Esc) para revisar el inicio" -ForegroundColor White
Write-Host ""
Write-Host "  Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
