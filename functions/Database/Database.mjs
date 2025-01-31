import { MongoClient } from "mongodb"
import { credential } from "./db_credential.mjs";
import { buttonReplyMessage, enviarMensajeWhatsapp } from "../services/whatsapp/Services.mjs";
export class Conversacion {
  constructor(number, messageId, username) {
    this.username = username;
    this.number = number;
    this.messageId = messageId;

    // URI de conexión
    const uri = `mongodb+srv://${credential.user}:${credential.password}@${credential.cluster}.amtem.mongodb.net/${credential.dbname}?retryWrites=true&w=majority`;
    this.client = new MongoClient(uri);

    // Base de datos y colecciones
    this.db = this.client.db(credential.dbname);
    this.collection = this.db.collection(credential.collect);
    this.collection_userinfo = this.db.collection(credential.collectinfo);
    this.collection_userAlarm = this.db.collection(credential.collectAlarm);
  }

  async check_User() {
    const user = await this.collection.findOne({ numero_id: this.number });
    return user;
  }

  async check_user_info() {
    const userInfo = await this.collection_userinfo.findOne({ numero_id: this.number });
    return userInfo;
  }

  async new_user() {
    const user = {
      usuario_id: this.username,
      numero_id: this.number,
      fecha_ingreso: new Date(),
      mensajes: []
    };
    console.log(user);
    const newUserInfo = await this.collection.insertOne(user);
    return newUserInfo;
  }

  async new_userinfo(name, numberx, correo) {
    const user = {
      usuario_id: this.username,
      numero_id: this.number,
      usuario_nombre: name,
      usuario_numero: numberx,
      usuario_correo: correo
    };
    const newUser = await this.collection_userinfo.insertOne(user);
    return newUser;
  }

  async check_userInfo_filtro(number) {

    const filtro = { numero_id: String(number) };

    const pipeline = [
      { $match: filtro }, // Filtrar por el usuario
      {
        $project: {
          _id: 0,
          usuario_nombre: 1, // Incluir nombre
          usuario_numero: 1, // Incluir número
          usuario_correo: 1  // Incluir correo
        }
      }
    ];

    const resultado = await this.collection_userinfo.findOne(pipeline).toArray();

    if (resultado.length > 0) {
      console.log("Result: ", resultado);
      return {
        nombre: resultado[0]?.usuario_nombre || "No disponible",
        correo: resultado[0]?.usuario_correo || "No disponible",
        telefono: resultado[0]?.usuario_numero || "No disponible"
      };
    } else {
      return null;
    }
  }


  async new_alarm(name, numberx) {
    const alarm = {
      usuario_id: name,
      numero_id: numberx,
      fecha_inicio: new Date(),
    };
    const newAlarm = await this.collection_userAlarm.insertOne(alarm);
    return newAlarm;
  }

  async delete_alarm(name, numberx) {
    const filterQuery = {
      usuario_id: name,
      numero_id: numberx
    };
    const result = await this.collection_userAlarm.deleteOne(filterQuery);
    return result.deletedCount;
  }

  async check_alarm() {
    try {
      const currentTime = new Date();
      console.log("check");
      console.log("", currentTime);
      const alarms = await this.collection_userAlarm.find().toArray();
      for (const alarm of alarms) {
        const fechaInicio = alarm.fecha_inicio ? new Date(alarm.fecha_inicio) : null;

        if (fechaInicio && (currentTime - fechaInicio) > 2 * 60 * 1000) { // Más de 4 minutos
          const usuarioId = alarm.usuario_id;
          const numeroId = alarm.numero_id;

          console.log("sale");
          const alertt = buttonReplyMessage(numeroId, ["Agendar cita 🗓️"], `${usuarioId} ¿Sigues interesado en nuestros servicios? Presiona el botón y podrás agendar una cita con uno asesor.`, "", "sed1", null);
          enviarMensajeWhatsapp(alertt);

          // Eliminar el documento
          await this.collection_userAlarm.deleteOne({ _id: alarm._id });
        }
      }
    } catch (error) {
      console.error("Error en checkAndProcessRecordatory:", error);
    }
  }

  async new_message(usertype, text) {
    const filtro = {
      usuario_id: this.username,
      numero_id: this.number
    };

    const message = {
      emisor: usertype,
      mensaje: text,
      timestamp: new Date()
    };

    const newMessage = await this.collection.updateOne(filtro, { $push: { mensajes: message } });
    return newMessage;
  }
}

export class History {
  constructor() {
    this.client = new MongoClient(`mongodb+srv://${credential.user}:${credential.password}@${credential.cluster}.amtem.mongodb.net/${credential.dbname}?retryWrites=true&w=majority`);
    this.db = this.client.db(credential.dbname);
    this.collection = this.db.collection(credential.collect);
  }
  async historialWrite(nameuser, step) {
    const filtro = { usuario_id: nameuser };
    const pipeline = [
      { $match: { usuario_id: nameuser } }, // Filtrar por usuario
      {
        $project: {
          mensajes: {
            $slice: ["$mensajes", step] // Seleccionar los últimos 'step' mensajes
          },
          _id: 0 // Excluir el campo _id
        }
      },
      {
        $project: {
          mensajes: {
            mensaje: 1,
          }
        } // Limitar los campos dentro de los mensajes
      }
    ];
    const messages = []
    const resultado = await this.collection.aggregate(pipeline).toArray();
    resultado.forEach((element, index) => {
      console.log(`Elemento ${index + 1}:`);
      element.mensajes.forEach((mensaje, i) => {
        console.log(`  Mensaje ${i + 1}:`);
        for (const [key, value] of Object.entries(mensaje)) {
          console.log(`    ${key}: ${value}`);
          messages.push(value);
        }
      });
    });
    return messages;
  }

  historialRead(resultado, clave) {
    let check = null; // En JavaScript se usa null en lugar de None
    let i = 0; // Aunque no se usa en la lógica, lo incluyo por consistencia

    // Verificamos si resultado[0] y resultado[0].mensajes existen para evitar errores
    if (resultado.length > 0) {
      for (const mensaj of resultado) { // Usamos for...of para iterar arrays
        if (mensaj === clave) { // Usamos === para comparación estricta
          check = `se envia el correo + ${clave}`; // Template literals para interpolación de strings
          break; //añadido break para que se salga del bucle una vez que lo encuentra
        }
      }
    } else {
      console.error("El formato del resultado es incorrecto. Se esperaba resultado[0].mensajes");
    }

    // Operador ternario para simplificar el condicional
    console.log(check ? check : `No se envia el correo + ${clave}`);

    return check;
  }

  historialMessages(resultado, clave) {
    for (let i = 0; i < resultado[0]?.mensajes.length; i++) {
      if (resultado[0]?.mensajes[i].mensaje === clave) {
        return i;
      }
    }
    return null;
  }

}