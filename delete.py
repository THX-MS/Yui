import os

fileTest = "./mp3/som.mp3"

try:
    os.remove(fileTest)
except OSError as e:
    print(e)
else:
    print("File is deleted successfully")