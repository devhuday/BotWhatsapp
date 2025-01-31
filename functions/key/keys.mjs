import fs from "fs";

// Leer el archivo de configuración
const configFile = fs.readFileSync("./key/key.txt", "utf-8");

// Convertir el contenido a un objeto
const config = Object.fromEntries(
    configFile
        .split("\n")
        .map((line) => line.trim().split("="))
);

// Usar las variables de configuración
const VERIFY_TOKEN = config.VERIFY_TOKEN;
const WHATSAPP_ENDPOINT = config.WHATSAPP_ENDPOINT;
const WHATSAPP_TOKEN = config.WHATSAPP_TOKEN;

export default { VERIFY_TOKEN, WHATSAPP_TOKEN, WHATSAPP_ENDPOINT };
