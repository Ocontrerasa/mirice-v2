function Procesar-Descarga {
    param(
        [Parameter(Mandatory=$true)][string]$NombreArchivo,
        [Parameter(Mandatory=$true)][string]$RutaDestino
    )
    $origen = Join-Path "downloads" $NombreArchivo
    if (-not (Test-Path $origen)) {
        Write-Host "No encontre '$NombreArchivo' dentro de la carpeta downloads." -ForegroundColor Red
        return
    }
    Copy-Item -Path $origen -Destination $RutaDestino -Force
    $marca = Get-Date -Format "yyyyMMdd_HHmmss"
    Move-Item -Path $origen -Destination "..\old_downloads\${marca}_$NombreArchivo" -Force
    Write-Host "OK: $NombreArchivo -> $RutaDestino (archivado en old_downloads)" -ForegroundColor Green
}
