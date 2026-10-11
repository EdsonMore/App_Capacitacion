import sys
from PIL import Image

def convert_white_to_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if pixel is white or close to white (R>210, G>210, B>210)
        if item[0] > 210 and item[1] > 210 and item[2] > 210:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Transparent PNG generated successfully!")

if __name__ == "__main__":
    convert_white_to_transparent(
        r"c:\Users\YASMIN  ZETA\Desktop\PuraFruit_Landing\PuraFruit-Landing\assets\images\purafruit_logo.png",
        r"c:\Users\YASMIN  ZETA\Desktop\PuraFruit_Landing\PuraFruit-Landing\assets\images\purafruit_logo_transparent.png"
    )
