param(
    [Parameter(Mandatory = $true)]
    [uri]$FunctionUrl
)

$bookDataPath = Join-Path $PSScriptRoot '..\books.json'
$bookData = Get-Content -Raw -LiteralPath $bookDataPath

Invoke-RestMethod `
    -Method Post `
    -Uri $FunctionUrl `
    -ContentType 'application/json' `
    -Body $bookData
