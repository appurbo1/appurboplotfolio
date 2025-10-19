Add-Type -AssemblyName System.Net
$h = New-Object System.Net.HttpListener
$prefix = "http://localhost:8000/"
$h.Prefixes.Add($prefix)
$h.Start()
Write-Host "Static server running at $prefix"

function Get-ContentType([string]$path) {
    switch -regex ($path) {
        '\.html?$' { 'text/html' }
        '\.css$' { 'text/css' }
        '\.js$' { 'application/javascript' }
        '\.png$' { 'image/png' }
        '\.jpe?g$' { 'image/jpeg' }
        '\.svg$' { 'image/svg+xml' }
        '\.mp4$' { 'video/mp4' }
        default { 'application/octet-stream' }
    }
}

while ($h.IsListening) {
    $ctx = $h.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    try {
        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath) -or $localPath -eq '') {
            $localPath = 'index.html'
        }
        $fsPath = Join-Path (Get-Location) $localPath
        if (Test-Path -LiteralPath $fsPath) {
            $bytes = [System.IO.File]::ReadAllBytes($fsPath)
            $res.ContentType = Get-ContentType $fsPath
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [Text.Encoding]::UTF8.GetBytes('Not Found')
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        $res.StatusCode = 500
        $msg = [Text.Encoding]::UTF8.GetBytes($_.ToString())
        $res.OutputStream.Write($msg, 0, $msg.Length)
    } finally {
        $res.Close()
    }
}