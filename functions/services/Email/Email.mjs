import { createTransport } from 'nodemailer';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from "url";
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Mostrar la ruta actual

// Credenciales de Gmail
const EMAIL_USER = "botgreenglo@gmail.com";
const EMAIL_PASSWORD = "iamo tirh hudn naav";

// Función para enviar el correo
async function enviarCorreo(destinatario, asunto, mensaje, footer, numero) {
    console.log("Directorio actual (__dirname):", __dirname);

    // Listar archivos en el directorio
    try {
        const archivos = readdirSync(__dirname);
        console.log("Archivos en el directorio:", archivos);
    } catch (error) {
        console.error("Error al listar archivos:", error);
    }
    try {
        // Configuración del transporte SMTP
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });
        console.log("", asunto);

        // Cargar la plantilla HTML
        const rutaPlantilla = join(__dirname, "..", "Email", "plantilla.html");
        console.log("Ruta generada para la plantilla:", rutaPlantilla)
        const plantillaHtml = readFileSync("./services/Email/plantilla.html", "utf-8")
            .replace("{nombre}", asunto)
            .replace("{textbody}", mensaje)
            .replace("{telefono}", numero)
            .replace("{footer}", footer);

        // Configuración del mensaje
        const mailOptions = {
            from: EMAIL_USER,
            to: destinatario,
            subject: asunto,
            html: plantillaHtml,
        };

        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado exitosamente:", info.response);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
}

// Función para preparar y enviar el correo con los datos proporcionados
function loadCorreo(nombre, correo, telefono, comentario) {
    const destinatario = "ventasbot@greenglo.com.co";
    const asunto = "Petición reunión Greenglo";
    const footer = "<b>Equipo Greenglo S.A.S.</b>";
    const encargado = "Heiner";

    const mensaje = `
    <br><br>¡Hola ${encargado}!<br>
    Tienes una nueva solicitud de cita de ${nombre}.<br>
    Aquí tienes la información del cliente:<br><br>
    <b>Nombre:</b> ${nombre}<br>
    <b>Correo electrónico:</b> ${correo}<br>
    <b>Teléfono:</b> ${telefono}<br>
    <b>Motivo de la cita:</b> ${comentario}<br><br>
    Por favor, contacta con ${nombre} lo antes posible para confirmar<br>
    la cita y coordinar los detalles.<br>
    ¡Esperamos que tengas una excelente reunión!<br>
    Atentamente...<br><br>
  `;
    return [destinatario, asunto, mensaje, footer]
    // Llamar a la función para enviar el correo
    //enviarCorreo(destinatario, asunto, mensaje, footer, telefono);
}


export default { enviarCorreo, loadCorreo };
