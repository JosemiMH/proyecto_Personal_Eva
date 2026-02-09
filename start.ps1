try {
    node --loader tsx server/index.ts
}
catch {
    Write-Host "Error occurred"
    $Error[0] | Out-File -FilePath error-log.txt
    Get-Content error-log.txt
}
