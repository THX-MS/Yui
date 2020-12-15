import gtts
import sys

msg = sys.argv[1]
msg = msg.replace("!tts ", "")

obj = gtts.gTTS(text = msg, lang = "pt-br", slow = False)
obj.save("mp3/soung.mp3")

print("Pronto")