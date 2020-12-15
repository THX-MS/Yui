import gtts
import sys

msg = sys.argv[1]
msg = msg.replace("!tts ", "")

obj = gtts.gTTS(text = msg, lang = "pt-br", slow = False)
obj.save("./mp3/som.mp3")

print("MP3 SALVO")