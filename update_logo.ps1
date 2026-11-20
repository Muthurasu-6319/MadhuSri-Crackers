Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public\images\mockup.jpg"))

# Exact clean coordinates for logo
$x = 18; $y = 24; $w = 125; $h = 32

$rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($j = 0; $j -lt $h; $j++) {
    for ($i = 0; $i -lt $w; $i++) {
        $c = $src.GetPixel($x + $i, $y + $j)
        # Calculate brightness / whiteness
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            # Completely transparent
            $dest.SetPixel($i, $j, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($c.R -gt 210 -and $c.G -gt 210 -and $c.B -gt 210) {
            # Edge smoothing: partially transparent
            $diff = 255 - [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            $alpha = [Math]::Min(255, [int]($diff * 5))
            $dest.SetPixel($i, $j, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $dest.SetPixel($i, $j, $c)
        }
    }
}

# Save to public/images/cropped/logo.png and public/images/logo.png
$dest.Save("public\images\cropped\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Save("public\images\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
if (Test-Path "dist\images\cropped") {
    $dest.Save("dist\images\cropped\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
}

# Create pure white version for footer
$whiteLogo = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($j = 0; $j -lt $h; $j++) {
    for ($i = 0; $i -lt $w; $i++) {
        $c = $dest.GetPixel($i, $j)
        if ($c.A -gt 10) {
            $whiteLogo.SetPixel($i, $j, [System.Drawing.Color]::FromArgb($c.A, 255, 255, 255))
        } else {
            $whiteLogo.SetPixel($i, $j, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}
$whiteLogo.Save("public\images\cropped\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
$whiteLogo.Save("public\images\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)

$whiteLogo.Dispose()
$dest.Dispose()
$src.Dispose()
Write-Output "Successfully updated logo.png and logo-white.png with transparent background!"
