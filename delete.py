import os

fileTest = "./mp3/som.ogg"

try:
    os.remove(fileTest)
except OSError as e:
    print(e)
else:
    print("File is deleted successfully")