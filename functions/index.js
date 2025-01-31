const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
const ChatFlow = require("./Chat/Flow_chat/Flow.mjs");
const services = require("./services/whatsapp/Services.mjs");
const Key = require("./key/keys.mjs");
const { getMessageDelay } = require("./Chat/Chat_delay/message_delay.mjs");
const { onSchedule } = require("firebase-functions/v2/scheduler");
admin.initializeApp();

// Middleware para parsear JSON
app.use(express.json());

//lnk: https://us-central1-jezplabotgreenglo.cloudfunctions.net/webhook/webhook

// Ruta para verificación del webhook (GET)
app.get("/webhook", (req, res) => {
  try {
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (token === Key.default.VERIFY_TOKEN && challenge) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Token incorrecto :.c");
  } catch (error) {
    console.error("Error en verificación:", error);
    return res.status(403).send(error.message);
  }
});

// Ruta para recibir mensajes (POST)
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("Evento recibido:", JSON.stringify(body, null, 2));

    if (!body.entry ||
      !body.entry[0].changes ||
      !body.entry[0].changes[0].value) {
      return res.status(400).send("Solicitud inválida");
    }

    const value = body.entry[0].changes[0].value;

    if (value.messages && value.messages.length > 0) {
      const message = value.messages[0];
      const number = message.from;
      const messageId = message.id;
      const name = value.contacts[0].profile.name;
      //const text = obtenerMensajeWhatsapp(message)
      const text = services.obtenerMensajeWhatsapp(message);
      console.log(`Mensaje recibido de ${name} (${number}): ${text}`);
      await services.enviarMensajeWhatsapp(services.markReadMessage(messageId));
      await ChatFlow.administrar_chatbot(text, number, messageId, name);

      // Marcar como leído

      //let Utext = Unidecode(text);
      let x = `Mensaje recibido de ${name} (${number}): ${text}`;
      console.log(x);

      return res.status(200).send("Evento procesado");
    }

    if (value.statuses) {
      console.log("Estado del mensaje:", value.statuses[0]);
      return res.status(200).send("Estado procesado");
    }

    return res.status(200).send("Evento no procesable");
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return res.status(500).send("Error interno del servidor");
  }
});

exports.taskEveryMinute = onSchedule('every 1 minutes', async () => {
  console.log("Tarea ejecutada cada minuto.");
  try {
    console.log("Ejecutando la tarea programada correctamente.");
    await getMessageDelay();
  } catch (error) {
    console.error("Error al ejecutar la tarea programada:", error);
  }
  return null;
});


// Exportar la función de Firebase
exports.webhook = functions.https.onRequest(app);
