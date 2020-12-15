import gtts
import sys

msg = sys.argv[1]
print(msg)
msg = msg.replace("!tts ", "")

obj = gtts.gTTS(text = msg, lang = "pt-br", slow = False)
obj.save("mp3/sound.wav")

print("Pronto")
