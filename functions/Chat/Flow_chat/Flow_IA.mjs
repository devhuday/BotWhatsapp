import * as ia from "../../services/IA/IaRequest.mjs";
import { RESPONSE_IA, FOOTER, ENDFLOW, ENDFLOW_OPTION } from "../Bot_Response/Responses.mjs";
import * as services from "../../services/whatsapp/Services.mjs";
import { History, Conversacion } from "../../Database/Database.mjs";
import * as bot from "../Bot_Response/Textbot.mjs";
import Email from "../../services/Email/Email.mjs";
import { eraser } from "../../tools/Extract_info.mjs";

async function verificarIA(text, respuestaIA, number, name, messageId) {
    console.log("init History");
    const history = new History();
    const conversa = new Conversacion(number, messageId, name);
    console.log("fin History");
    async function enviarSolicitud(hist, tipoSolicitud) {
        console.log("info:");
        const {
            usuario_nombre: nombre,
            usuario_numero: telefono,
            usuario_correo: correo
        } = await conversa.check_user_info(number);
        const messageUs = hist[hist.length - 1];
        const [destinatario, asunto, mensaje, footer] = Email.loadCorreo(nombre, correo, telefono, messageUs);
        console.log("ya paso el footer");
        await Email.enviarCorreo(destinatario, asunto, mensaje, footer, number);
        await Email.enviarCorreo("hudaayy14@gmail.com", asunto, mensaje, footer, number);

        const soliEnv = "Solicitud enviada ✅\n\n";
        if (tipoSolicitud.includes("greenglopersonal")) {
            return [
                [services.buttonReplyMessage(number, ["Volver al inicio ✅"], soliEnv + bot.panelCompra.message, FOOTER, "sed1", messageId)],
                soliEnv + tipoSolicitud
            ];
        }
        return [
            [services.buttonReplyMessage(number, ["Volver al inicio ✅"], soliEnv + tipoSolicitud, FOOTER, "sed1", messageId)],
            soliEnv + tipoSolicitud
        ];
    }

    async function registroUsuario(hist) {
        const [nombre, correo, telefono, comentario] = eraser(text);
        const user = await conversacion.new_userinfo(nombre, telefono, correo);
        return [
            [services.buttonReplyMessage(
                number,
                history.historialRead(hist, "mantenimiento ") ? ["Mantenimiento 🔧"] : ["Cotizar"],
                `Fue registrado satisfactoriamente ✅\n\n${respuestaIA.slice(0, -13)}${botonInf}`,
                FOOTER,
                "sed1",
                messageId
            )]
        ], respuestaIA;
    }

    const botonInf = "\n\n*Si quieres continuar presiona el botón.*";
    console.log(`Nombre: ${name}`);
    console.log("init Write");
    const hist = await history.historialWrite(name, -5);
    console.log("fin write");
    console.log(hist);

    const accionesIA = {
        "registrogreen": () => registroUsuario(hist),
        "agendarbot": () => [
            [services.buttonReplyMessage(number, ["Cotizar"], `${respuestaIA.slice(0, -7)} Presionando el botón`, FOOTER, "sed1", messageId)],
            respuestaIA
        ],
        "greengloduda": () => [
            [services.textMessage(number, respuestaIA.slice(0, -12))],
            respuestaIA.slice(0, -12)
        ],
        "cotigreenglo": () => [
            [services.buttonReplyMessage(number, ["Cotizar"], `${respuestaIA.slice(0, -14)}${botonInf}`, FOOTER, "sed1", messageId)],
            respuestaIA
        ],
        "greenInforma": () => [
            [services.buttonReplyMessage(number, bot.welcome.option, `${respuestaIA.slice(0, -12)}${botonInf}`, FOOTER, "sed1", messageId)],
            respuestaIA
        ],
        "greenhola": () => [
            [services.buttonReplyMessage(number, ["Iniciar ✅"], `${respuestaIA.slice(0, -9)}\n\n*Si quieres Iniciar una cotización o otro servicio presiona el botón.*`, FOOTER, "sed1", messageId)],
            respuestaIA
        ],
        "asesorgreen": () => [
            [services.buttonReplyMessage(number, ["Agendar cita 🗓️"], `${respuestaIA.slice(0, -11)}\n\n*Para agendar una cita presiona el botón.*`, FOOTER, "sed1", messageId)],
            respuestaIA
        ],
        "greenglopersonal": () => [
            [services.buttonReplyMessage(number, ["Volver al inicio ✅", "Agenda cotización 🗓️"], `${respuestaIA.slice(0, -16)}\n\n*Si quieres hacer efectiva tu compra de paneles selecciona la primera opción de lo contrario la siguiente.*`, FOOTER, "sed1", messageId)],
            respuestaIA.slice(0, -16)
        ]
    };

    const messageAnt = hist[hist.length - 2];
    console.log("Ant:", messageAnt);
    if (messageAnt) {
        if (respuestaIA.includes("greenglo visita") || (bot.agendar.message.includes(messageAnt) && respuestaIA.includes("cotizacion"))) {
            console.log("visita1");
            if (history.historialRead(hist, "mantenimiento 🔧")) {
                console.log("visita2");
                return enviarSolicitud(hist, "Un asesor de greenglo se estará comunicando con usted lo más pronto posible.");
            }
            if (history.historialRead(hist, "agendar cita 🗓️")) {
                console.log("visita3");
                const tipoRespuesta = respuestaIA.includes("greenglo visita") ? respuestaIA.slice(0, -15) : respuestaIA.slice(0, -31);
                return enviarSolicitud(hist, tipoRespuesta);
            }
        } else if (respuestaIA.includes("greenglopersonal")) {
            console.log("visita4");
            if (history.historialRead(hist, "agenda cotizacion 🗓️")) {
                console.log("visita4");
                return enviarSolicitud(hist, respuestaIA);
            }

        }
    }

    for (const [key, action] of Object.entries(accionesIA)) {
        if (respuestaIA.includes(key)) {
            return action();
        }
    }

    // Caso por defecto
    console.log("Caso por defecto");
    respuestaIA = bot.Nomessage.message;
    let list = []
    list.push(services.buttonReplyMessage(number, bot.welcome.option, respuestaIA, FOOTER, "sed1"))
    return [list, respuestaIA];
}

async function procesarIA(number, text, responseData, messageId) {
    let lista_respuestas = [];
    const respuestaIA = await ia.Request(responseData.responseIA);
    console.log(`${responseData.action}`);
    if (responseData.action === "cotizar") {
        lista_respuestas.push(services.buttonReplyMessage(
            number,
            ["Cotizar"],
            `${respuestaIA}\n\n*Puedes seguir tu cotización presionando el botón*`,
            FOOTER,
            "sed2",
            messageId
        ));
        return lista_respuestas
    }

    return text_Message(number, respuestaIA);
}

async function recorrer(responsesDict, number, text, messageId, name) {
    for (const keyword in responsesDict) {
        if (keyword === text) {
            return await procesarIA(number, text, responsesDict[keyword], messageId);
        }
    }
    return null;
}

async function procesar_respuesta_general(text, number, messageId, name) {
    const respuesta_ia = await ia.Request(text);
    console.log("wewe");
    console.log(`nombrre: ${name}`);
    const [formatIA, respuestaIA] = await verificarIA(text, respuesta_ia, number, name, messageId);
    console.log("wewe2");
    const conver = await new Conversacion(number, messageId, name);
    await conver.new_message("bot_Greengol", respuestaIA);
    console.log("wewe3");
    console.log(formatIA);
    return formatIA;
}

async function enviar(dataResponse) {
    for (const respuesta of dataResponse) {
        await services.enviarMensajeWhatsapp(respuesta);
    }
}

export async function IAresponse(text, number, messageId, name) {
    const list_ia = await recorrer(RESPONSE_IA, number, text, messageId, name);
    console.log(`lista: ${list_ia}`);
    if (list_ia) {
        return list_ia;
    } else {
        console.log("procesar");
        let respuesta = await procesar_respuesta_general(text, number, messageId, name);
        return respuesta;
    }
}


