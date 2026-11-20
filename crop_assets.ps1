Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path "assets\images\mockup.jpg"))
$cropDir = "assets\images\cropped"
if (!(Test-Path $cropDir)) { New-Item -ItemType Directory -Path $cropDir -Force }

function Crop-Image($name, $x, $y, $w, $h) {
    # Ensure within bounds
    $x = [Math]::Max(0, [Math]::Min($src.Width - 1, $x))
    $y = [Math]::Max(0, [Math]::Min($src.Height - 1, $y))
    $w = [Math]::Min($w, $src.Width - $x)
    $h = [Math]::Min($h, $src.Height - $y)
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dest = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $outPath = Join-Path $cropDir $name
    $dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Saved: $name ($w x $h)"
}

# 1. Logo
Crop-Image "logo.png" 15 22 125 35

# 2. Hero Crackers Stack
Crop-Image "hero-crackers.png" 300 62 370 215

# 3. Categories (6 cards images)
Crop-Image "cat-flower-pots.png" 15 368 100 65
Crop-Image "cat-sparklers.png" 125 368 100 65
Crop-Image "cat-rockets.png" 235 368 100 65
Crop-Image "cat-ground-chakkars.png" 345 368 100 65
Crop-Image "cat-fancy-fountains.png" 455 368 100 65
Crop-Image "cat-gift-boxes.png" 565 368 100 65

# 4. Best Sellers (4 products images)
Crop-Image "prod-skyshot.png" 16 505 155 80
Crop-Image "prod-sparklers.png" 180 505 155 80
Crop-Image "prod-flowerpots.png" 344 505 155 80
Crop-Image "prod-chakkar.png" 508 505 155 80

# 5. Promo Banner Diya
Crop-Image "promo-banner.png" 8 648 666 65

# 6. Testimonial Avatars
Crop-Image "avatar-arun.png" 27 795 42 42
Crop-Image "avatar-priya.png" 248 795 42 42
Crop-Image "avatar-vikram.png" 468 795 42 42

$src.Dispose()
