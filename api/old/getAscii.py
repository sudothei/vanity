import io
import requests
import PIL.Image
import aalib

def getAscii(imagepath):
    screen = aalib.AsciiScreen(width=40, height=15)
    with open(imagepath, 'rb') as fh:
        file = fh.read()
    fp = io.BytesIO(file)
    image = PIL.Image.open(fp).convert('L').resize(screen.virtual_size)
    screen.put_image((0, 0), image)
    return screen.render()
