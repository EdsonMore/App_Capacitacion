Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\YASMIN  ZETA\Desktop\PuraFruit_Landing\PuraFruit-Landing\assets\images\purafruit_logo.png"
$outputPath = "c:\Users\YASMIN  ZETA\Desktop\PuraFruit_Landing\PuraFruit-Landing\assets\images\purafruit_logo_transparent.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$transparentBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($transparentBmp)
$g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
$g.Dispose()

for ($x = 0; $x -lt $transparentBmp.Width; $x++) {
    for ($y = 0; $y -lt $transparentBmp.Height; $y++) {
        $pixel = $transparentBmp.GetPixel($x, $y)
        if ($pixel.R -gt 220 -and $pixel.G -gt 220 -and $pixel.B -gt 220) {
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}

$transparentBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$transparentBmp.Dispose()
Write-Host "TRANSPARENT PNG GENERATED SUCCESSFULLY"
