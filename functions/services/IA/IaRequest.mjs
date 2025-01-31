import axios from 'axios';
export async function Request(text) {
  //const bot1 = "450ea510-e8e7-40c9-84d3-d1c411ddf3ba";

  const bot1 = "cf62d601-f71c-4e46-9542-ce1ff36a23e4";
  const bot2 = "d9130357-caf9-4d82-a793-bad18c93f15b";

  async function makeRequest(botId) {
    const url = `https://magicloops.dev/api/loop/run/${botId}`;
    const payload = { consulta: text };

    try {
      const response = await axios.get(url, {
        data: payload, timeout: 5000
      }); // Timeout para evitar
      if (response.status === 200 && response.data.loopOutput) {
        return response.data.loopOutput;
      }
      return null;
    } catch (error) {
      console.error(`Error con el bot ${botId}: ${error.message}`);
      return null;
    }
  }

  // Intentar con bot1
  let output = await makeRequest(bot1);
  if (output) {
    console.log(`Respuesta obtenida de bot1: ${output}`);
    return output;
  }

  // Si bot1 falla, intentar con bot2
  console.log("Intentando con bot2...");
  output = await makeRequest(bot2);
  if (output) {
    console.log(`Respuesta obtenida de bot2: ${output}`);
    return output;
  }

  // Si ambos bots fallan
  console.log("No se obtuvo respuesta de ninguno de los bots.");
  return null;
}

/*

Ejemplo de uso
Request("Tu texto aquí").then((respuesta) => {
  console.log("Respuesta final:", respuesta);
}).catch((error) => {
  console.error("Error al ejecutar la solicitud:", error.message);
});

*/
