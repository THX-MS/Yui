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
        conn.sendMessage(id, '[Aguarde] ⌛ Carregando Sticker...', MessageType.text) // modificação top

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

   if (messageType == 'imageMessage'){
      let caption = imageMessage.caption.toLocaleLowerCase()

      if (caption == "!gifsticker" || caption == "!stickergif"){
         conn.sendMessage(id, "Deu certo", MessageType.text);
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

   if (text.includes("!girl"))
   {
      var itens = ["garota linda", "garota sexy", "garota thumblr", "garota estilosa"];
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

   if (text.includes("!boy"))
   {
      var itens = ["homem lindo", "homem sexy", "homem thumblr", "homem estiloso"];
      var boy = itens[Math.floor(Math.random() * itens.length)];
      var url = "https://api.fdci.se/rep.php?gambar=" + boy;

      axios.get(url)
         .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var boys = b[Math.floor(Math.random() * b.length)];
            imageToBase64(boys)
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

   if (text.includes("!searchimage"))
   {
      var texto = text.replace("!searchimage ", "");
      var url = "https://api.fdci.se/rep.php?gambar=" + texto;

      axios.get(url)
         .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var imagem = b[Math.floor(Math.random() * b.length)];
            imageToBase64(imagem)
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
      var texttomp3 = require("text-to-mp3");
      var texto = text.replace("!tts ", "");
      const filepath = "./mp3/som.mp3";

      conn.sendMessage(id, "[Aguarde] ⌛ Carregando Audio...", MessageType.text);

      texttomp3.getMp3(texto, function(err, data){
         if (err){
            console.log(err);
         }
         var file = fs.createWriteStream(filepath);
         file.write(data);

         console.log("MP3 SAVED");
      });
      setTimeout(function(){
         const buffer = fs.readFileSync(filepath);
         setTimeout(function(){
            conn.sendMessage(id, buffer, MessageType.audio);
         }, 3000);
      }, 3000);
   }

   if (text.includes("!say")){
      var texto = text.replace("!say ", "");
      conn.sendMessage(id, texto, MessageType.text);
   }

   /*if (text.includes("!tts")) {
      const fs = require("fs");
      const spawn = require("child_process").spawn;

      conn.sendMessage(id, "[Aguarde] ⌛ Carregando Audio...", MessageType.text)

      // code to run the code skeak.py in python

      const process = spawn("python", ["./speech.py", text]);
      process.stdout.on('data', data => {
         console.log(data.toString());
      });

      if (text.length > 200){
         conn.sendMessage(id, "Mensagem muito longa", MessageType.text);
      }else{

      // function to send message audio with delay
      setTimeout(function(){
      const buffer = fs.readFileSync("./mp3/som.mp3", {encoding: 'utf-8', flag: 'r'});
      setTimeout(function(){
      conn.sendMessage(id, buffer, MessageType.audio)}, 4000);

      // function to delete audio message inside the mp3 folder
      setTimeout(function(){
      const process2 = spawn("python", ["./delete.py"]);
      process2.stdout.on('data', data => {
         console.log(data.toString());
      });}, 
      12000);
      }, 5000);
   }
   }*/
      })