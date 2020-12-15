import gtts
import sys

#msg = sys.argv[1]
#msg = msg.replace("!tts ", "")
msg = "bom dia"

obj = gtts.gTTS(text = msg, lang = "pt-br", slow = False)
obj.save("./mp3/som.ogg")

print("Pronto")