import * as services from "../../services/whatsapp/Services.mjs";
import * as bot from "../Bot_Response/Textbot.mjs";
import * as sett from '../../Assets/Assets.mjs';
import { History, Conversacion } from "../../Database/Database.mjs";
import { RESPONSES, RESPONSE_FLEX, RESPONSE_IA, FOOTER, ENDFLOW, ENDFLOW_OPTION } from "../Bot_Response/Responses.mjs";
import { IAresponse } from "./Flow_IA.mjs";
function Unidecode(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function enviar_media(number, mediaId, mediaCategory, responseData, text) {
  if (mediaCategory === "image") {
    return services.imageMessage(number, services.getMediaId(mediaId, mediaCategory), responseData.body);
  }
  if (mediaCategory === "documents") {
    if (mediaId.includes("cotizacion_")) {
      return services.documentMessage(number, sett.documents[`cotizacion_${text.slice(13, -3)}`], responseData.body, `Cotización ${text.slice(13, -3)} kwh.pdf`);
    }
    return services.documentMessage(number, sett.documents[mediaId], responseData.body, `${mediaId.charAt(0).toUpperCase() + mediaId.slice(1).replace(/_/g, ' ')}.pdf`);
  }
}

function generar_botones(number, responseData, messageId) {
  if (responseData.list) {
    return services.listReplyMessage(number, responseData.options, responseData.question, FOOTER, "sed1", messageId);
  }
  return services.buttonReplyMessage(number, responseData.options, responseData.question, FOOTER, "sed1", messageId);
}

//(number, text, messageId, responseData, conver, name)
async function enviar_respuesta(number, text, messageId, responseData, name) {
  let lista_respuestas = [];
  const conver = new Conversacion(number, messageId, name);

  if (responseData.media) {
    const [mediaId, mediaCategory] = responseData.media;
    lista_respuestas.push(enviar_media(number, mediaId, mediaCategory, responseData, text));
    await conver.new_message("bot", responseData.body);
    //conver.new_message("bot_Greengol", responseData.body || "");
  }

  if (responseData.body && !responseData.media) {
    lista_respuestas.push(services.textMessage(number, responseData.body));
    await conver.new_message("bot", responseData.body);
    //conver.new_message("bot_Greengol", responseData.body);
  }

  if (responseData.credito) {
    lista_respuestas.push(services.textMessage(number, bot.credito.message));
    await conver.new_message("bot", bot.credito.message);
    //conver.new_message("bot_Greengol", bot.credito.message);
  }

  if (responseData.options) {
    const reply = generar_botones(number, responseData, messageId);
    lista_respuestas.push(reply);
    await conver.new_message("bot", responseData.question);
    //conver.new_message("bot_Greengol", responseData.question);
  }

  if (responseData.contact) {
    const [nameId, numberId] = responseData.contact;
    lista_respuestas.push(services.contactMessage(number, sett.contact[nameId], sett.contact[numberId]));
  }

  if (responseData.alerta) {
    const menssage = new Conversacion(number, messageId, name);
    menssage.new_alarm(name, number);
  }

  if (responseData.responseIA) {
    //lista_respuestas.push(procesar_ia(number, text, responseData, messageId));
  }

  return lista_respuestas;
}

async function buscarRespuesta(responsesDict, number, text, messageId, name, esParcial = false) {
  for (const keyword in responsesDict) {
    if (esParcial ? text.includes(keyword) : keyword === text) {
      return await enviar_respuesta(number, text, messageId, responsesDict[keyword], name);
    }
  }
  return null;
}

export async function administrar_chatbot(text, number, messageId, name) {
  async function mensajes(dataResponse) {
    for (const respuesta of dataResponse) {
      await services.enviarMensajeWhatsapp(respuesta);
    }
  }

  const textInit = text;
  text = Unidecode(text.toLowerCase());
  console.log("tu texto: ", text);

  const conver = new Conversacion(number, messageId, name);
  const userExists = await conver.check_User();
  if (!userExists) {
    await conver.new_user();
    await conver.new_message("usuario", "Nuevo usuario ingreso");
  }
  await conver.new_message("usuario", text);

  if (text === "iniciar ✅" || text === "volver al inicio ✅") {
    text = "Holax";
  }

  const checkUser = await conver.check_user_info()
  console.log("user:", checkUser);
  if (text === "agenda cotizacion 🗓️" && checkUser) {
    console.log("entropanel");
    text = "panelc";
  } else if (textInit.includes(bot.welcome.option[0])) {
    console.log("entro");
    text = checkUser ? "cotizar" : "cotizacion";
    console.log("text: ", text);
  } else if (text === bot.welcome.option[1] && checkUser) {
    text = "citaManteni";
  }

  let listAnswers = await buscarRespuesta(RESPONSES, number, text, messageId, name);
  console.log(`se enviara:${listAnswers}`);

  if (listAnswers) {
    mensajes(listAnswers);
  } else {
    listAnswers = await buscarRespuesta(RESPONSE_FLEX, number, text, messageId, name, true);
    console.log(`se enviara:${listAnswers}`);
    if (listAnswers) {
      mensajes(listAnswers);
    } else {
      console.log(`se usara la ia`);
      let respuestaIA = await IAresponse(text, number, messageId, name)
      mensajes(respuestaIA);
    }
  }
}