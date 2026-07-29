param(
    [Parameter(Mandatory = $true)]
    [uri]$FunctionUrl,

    [ValidateSet('Basic', 'Standard', 'Premium')]
    [string]$PackageType = 'Premium'
)

$requestBody = @{
    packageType = $PackageType
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod `
        -Method Post `
        -Uri $FunctionUrl `
        -ContentType 'application/json' `
        -Body $requestBody `
        -ErrorAction Stop

    $result | ConvertTo-Json -Depth 10
}
catch {
    $response = $_.Exception.Response

    if ($null -ne $response) {
        Write-Error "HTTP $([int]$response.StatusCode) $($response.StatusDescription)"

        $requestId = $response.Headers['X-Fc-Request-Id']
        if ($requestId) {
            Write-Error "Alibaba Cloud request ID: $requestId"
        }

        $stream = $response.GetResponseStream()
        if ($null -ne $stream) {
            $reader = [System.IO.StreamReader]::new($stream)
            $responseBody = $reader.ReadToEnd()
            $reader.Dispose()

            if ($responseBody) {
                Write-Error "Response body: $responseBody"
            }
        }
    }

    exit 1
}
