# Script de automatización corregido para inicializar y subir mirice-v2 a GitHub
Set-Location -Path $PSScriptRoot

Write-Host "=== CONFIGURANDO GIT Y CORRIGIENDO NOMBRES DE ARCHIVOS ===" -ForegroundColor Cyan

# 1. Habilitar rutas largas en Git
git config core.longpaths true

# 2. Renombrar archivos PDF con nombres excesivamente largos o caracteres especiales en fuentes/
$fuentesPath = Join-Path $PSScriptRoot "fuentes"
if (Test-Path $fuentesPath) {
    Get-ChildItem -Path $fuentesPath -File | ForEach-Object {
        $oldName = $_.Name
        $newName = $oldName

        # Simplificar nombres con codificación Unicode dañada o rutas largas
        if ($oldName -like "*Gu#U00eda*") {
            $newName = "Guia_Apoderados_Convivencia_Supereduc.pdf"
        } elseif ($oldName -like "*ORD-No-0469*") {
            $newName = "ORD_0469_Guia_Seguridad.pdf"
        } elseif ($oldName -like "*REX-N#U00b0-782*") {
            $newName = "REX_782_Circular_Medidas_Formativas.pdf"
        } elseif ($oldName -like "*Circular-Ley-de-autismo (1)*") {
            $newName = "Circular-Ley-de-autismo.pdf"
        } elseif ($oldName -like "*GUIA-PRACTICA-DE-MEDIDAS-DE-SEGURIDAD (1)*") {
            $newName = "GUIA-PRACTICA-DE-MEDIDAS-DE-SEGURIDAD.pdf"
        }

        if ($oldName -ne $newName) {
            $targetPath = Join-Path $fuentesPath $newName
            Rename-Item -Path $_.FullName -NewName $newName -Force
            Write-Host "-> Renombrado: $oldName -> $newName" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== AGREGANDO ARCHIVOS A GIT ===" -ForegroundColor Cyan
git add .
git commit -m "feat: versión corregida y completa de MiRice v2 (producción 2026)"

Write-Host "`n=== INSTRUCCIONES PARA PUBLICAR EN GITHUB ===" -ForegroundColor Green
Write-Host "1. Ingresa a https://github.com/new y crea el repositorio 'mirice-v2' (Público)." -ForegroundColor White
Write-Host "2. Copia y pega en esta consola los siguientes comandos:`n" -ForegroundColor Yellow
Write-Host "git remote add origin https://github.com/<tu-usuario>/mirice-v2.git" -ForegroundColor Cyan
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main`n" -ForegroundColor Cyan
