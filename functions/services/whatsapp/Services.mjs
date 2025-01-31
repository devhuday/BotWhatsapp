// Importa configuraciones
import * as sett from '../../Assets/Assets.mjs';
import keys from '../../key/keys.mjs';

// Obtener mensaje de WhatsApp
export function obtenerMensajeWhatsapp(message) {
    if (!message.type) {
        return 'mensaje no reconocido';
    }

    const typeMessage = message.type;
    let text;

    switch (typeMessage) {
        case 'text':
            text = message.text.body;
            break;
        case 'button':
            text = message.button.text;
            break;
        case 'interactive':
            if (message.interactive.type === 'list_reply') {
                text = message.interactive.list_reply.title;
            } else if (message.interactive.type === 'button_reply') {
                text = message.interactive.button_reply.title;
            }
            break;
        default:
            text = 'mensaje no procesado';
    }

    return text;
}

// Enviar mensaje de WhatsApp
export async function enviarMensajeWhatsapp(data) {
    try {
        const whatsappToken = keys.WHATSAPP_TOKEN;
        const whatsappUrl = keys.WHATSAPP_ENDPOINT;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${whatsappToken}`
        };

        const response = await fetch(whatsappUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return { message: 'mensaje enviado', status: 200 };
        } else {
            return { message: 'error al enviar mensaje', status: response.status };
        }
    } catch (error) {
        console.error('No se envió el mensaje:', error);
        return { message: error.message, status: 403 };
    }
}

// Construir mensaje de texto
export function textMessage(number, text) {
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'text',
        text: {
            body: text
        }
    };
}

// Enviar plantilla
export function enviarPlantilla(number) {
    return {
        messaging_product: 'whatsapp',
        to: number,
        type: 'template',
        template: {
            name: 'testing_plantilla',
            language: {
                code: 'en_US'
            }
        }
    };
}

// Construir mensaje de botón interactivo
export function buttonReplyMessage(number, options, body, footer, sedd) {
    const buttons = options.map((option, i) => ({
        type: 'reply',
        reply: {
            id: `${sedd}_btn_${i + 1}`,
            title: option
        }
    }));

    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'interactive',
        interactive: {
            type: 'button',
            body: { text: body },
            footer: { text: footer },
            action: { buttons }
        }
    };
}

// Construir mensaje de lista interactiva
export function listReplyMessage(number, options, body, footer, sedd) {
    const rows = options.map((option, i) => ({
        id: `${sedd}_row_${i + 1}`,
        title: option,
        description: ''
    }));

    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'interactive',
        interactive: {
            type: 'list',
            body: { text: body },
            footer: { text: footer },
            action: {
                button: 'Ver Opciones',
                sections: [{ title: 'Secciones', rows }]
            }
        }
    };
}

// Construir mensaje de documento
export function documentMessage(number, url, caption, filename) {
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'document',
        document: { link: url, caption, filename }
    };
}

// Construir mensaje de contacto
export function contactMessage(number, name, phone) {
    const phoneFormatted = `+57 ${phone}`;
    const waId = `57${phone}`;
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'contacts',
        contacts: [{
            name: { first_name: name, formatted_name: name },
            phones: [{ phone: phoneFormatted, wa_id: waId, type: 'Celular' }]
        }]
    };
}

// Construir mensaje de imagen
export function imageMessage(number, url, caption) {
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'image',
        image: { link: url, caption }
    };
}

// Construir mensaje de sticker
export function stickerMessage(number, stickerId) {
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'sticker',
        sticker: { id: stickerId }
    };
}

// Obtener ID de media
export function getMediaId(mediaName, mediaType) {
    switch (mediaType) {
        case 'sticker':
            return sett.stickers[mediaName];
        case 'image':
            return sett.image[mediaName];
        case 'documents':
            return sett.documents[mediaName];
        default:
            return null;
    }
}

// Construir reacción
export function replyReactionMessage(number, messageId, emoji) {
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'reaction',
        reaction: { message_id: messageId, emoji }
    };
}

// Construir mensaje de texto en respuesta
export function replyTextMessage(number, messageId, text) {
    return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        context: { message_id: messageId },
        type: 'text',
        text: { body: text }
    };
}

// Marcar mensaje como leído
export function markReadMessage(messageId) {
    return {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
    };
}


