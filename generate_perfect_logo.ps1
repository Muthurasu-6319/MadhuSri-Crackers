Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public\images\mockup.jpg"))

$x = 17; $y = 23; $w = 120; $h = 36

# Extract raw
$crop = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($j = 0; $j -lt $h; $j++) {
    for ($i = 0; $i -lt $w; $i++) {
        $c = $src.GetPixel($x + $i, $y + $j)
        # Background transparency
        if ($c.R -gt 242 -and $c.G -gt 242 -and $c.B -gt 242) {
            $crop.SetPixel($i, $j, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($c.R -gt 215 -and $c.G -gt 215 -and $c.B -gt 215) {
            $diff = 255 - [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            $alpha = [Math]::Min(255, [int]($diff * 6))
            $crop.SetPixel($i, $j, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $crop.SetPixel($i, $j, $c)
        }
    }
}

# 2x High-DPI Upscale for razor-sharp rendering on modern displays
$scale = 2
$hiDpi = New-Object System.Drawing.Bitmap(($w * $scale), ($h * $scale), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($hiDpi)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($crop, 0, 0, ($w * $scale), ($h * $scale))
$g.Dispose()

# Save color logo
$hiDpi.Save("public\images\cropped\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$hiDpi.Save("public\images\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
if (Test-Path "dist\images\cropped") {
    $hiDpi.Save("dist\images\cropped\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
}

# Create matching white logo for dark/footer backgrounds
$whiteLogo = New-Object System.Drawing.Bitmap(($w * $scale), ($h * $scale), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($j = 0; $j -lt ($h * $scale); $j++) {
    for ($i = 0; $i -lt ($w * $scale); $i++) {
        $c = $hiDpi.GetPixel($i, $j)
        if ($c.A -gt 15) {
            $whiteLogo.SetPixel($i, $j, [System.Drawing.Color]::FromArgb($c.A, 255, 255, 255))
        } else {
            $whiteLogo.SetPixel($i, $j, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}
$whiteLogo.Save("public\images\cropped\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
$whiteLogo.Save("public\images\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
if (Test-Path "dist\images\cropped") {
    $whiteLogo.Save("dist\images\cropped\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
}

$whiteLogo.Dispose()
$hiDpi.Dispose()
$crop.Dispose()
$src.Dispose()
Write-Output "Successfully generated perfect Hi-DPI logo.png and logo-white.png!"
