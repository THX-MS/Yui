const qrcode = require("qrcode-terminal");
const menu = require("./menu.js");
const fs = require("fs");
const moment = require("moment");
const imageToBase64 = require("image-to-base64");
const axios = require("axios");
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
} = require("@adiwajshing/baileys");
const { count } = require("console");
var jam = moment().format("HH:mm");

function foreach(arr, func)
{
   for (var i in arr)
   {
      func(i, arr[i]);
   }
}
const conn = new WAConnection()
conn.on('qr', qr =>
{
   qrcode.generate(qr,
   {
      small: true
   });
   console.log(`[ ${moment().format("HH:mm:ss")} ] Por favor escaneie o QR-Code com seu aplicativo!`);
});

conn.on('credentials-updated', () =>
{
   console.log(`credentials updated!`)
   const authInfo = conn.base64EncodedAuthInfo()
   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})
fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json')
conn.connect();

conn.on('user-presence-update', json => console.log(json.id + ' presence is ' + json.type))
conn.on('message-status-update', json =>
{
   const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
   console.log(`${json.to}${participant} acknlowledged message(s) ${json.ids} as ${json.type}`)
})

conn.on('message-new', async(m) =>
{
   const messageContent = m.message
   const text = m.message.conversation
   let id = m.key.remoteJid
   const messageType = Object.keys(messageContent)[0] // message will always contain one key signifying what kind of message
   let imageMessage = m.message.imageMessage;
   let mediaMessage = m.message.mediaMessage;
   console.log(`[ ${moment().format("HH:mm:ss")} ] (${id.split("@s.whatsapp.net")[0]} => ${text}`);

   if (text == '!menu'){
    conn.sendMessage(id, menu.menu ,MessageType.text);
    }

    if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == '!sticker' || caption == "!stiker")
      {
        conn.sendMessage(id, '[Aguarde] ⌛ Carregando Sticker...', MessageType.text)

         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o temp/' + jam + '.webp', (error, stdout, stderr) =>
         {
            let stik = fs.readFileSync('temp/' + jam + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker)
         });
      }
   }

   if (messageType == Mimetype.gif){
      const caption = mediaMessage.caption.toLocaleLowerCase()
      if (caption == "!gifsticker"){
         conn.sendMessage(id, "Deu certo", MessageType.text)
      }
   }

   if (text.includes("!anime"))
   {
      var itens = ["anime girl", "anime beautiful", "anime", "anime aesthetic"];
      var girl = itens[Math.floor(Math.random() * itens.length)];
      var url = "https://api.fdci.se/rep.php?gambar=" + girl;

      axios.get(url)
         .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var girls = b[Math.floor(Math.random() * b.length)];
            imageToBase64(girls)
            .then(
               (response) => {
            var buf = Buffer.from(response, 'base64');
                  conn.sendMessage(
                     id, buf, MessageType.image)
               }
            )
            .catch(
               (error) => {
                  console.log(error);
               }
            )
         });

   }

   if (text.includes("!tts")) {
      const spawn = require("child_process").spawn;

      const process2 = spawn("python", ["./delete.py"]);
      process2.stdout.on('data', data => {
         console.log(data.toString());
      });
      var timeId = setTimeout(function(){
      if (text.length > 200){
         conn.sendMessage(id, "Mensagem muito longa", MessageType.text);
      }else{
      const process = spawn("python", ["./speak.py", text]);
      process.stdout.on('data', data => {
         console.log(data.toString());
      });
      }
      }, 4000);

      var timeId = setTimeout(function(){
      const buffer = fs.readFileSync("mp3/sound.mp3")
      conn.sendMessage(id, buffer, MessageType.audio);}, 7000);
   
   }

})
