import os

fileTest = "./mp3/som.wav"

try:
    os.remove(fileTest)
except OSError as e:
    print(e)
else:
    print("File is deleted successfully")