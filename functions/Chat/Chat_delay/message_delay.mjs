import { Conversacion } from "../../Database/Database.mjs";

export async function getMessageDelay() {
    const Conversaciones = new Conversacion(null, null, null);
    Conversaciones.check_alarm();
}