export function eraser(mensaje) {
  // 1. Buscar el nombre (dos palabras al inicio del mensaje)
  const nombreMatch = mensaje.match(/^\w+\s\w+/);
  const nombre = nombreMatch ? nombreMatch[0] : "No encontrado";

  // 2. Buscar el correo electrónico
  const correoMatch = mensaje.match(/\w+@\w+\.\w+/);
  const correo = correoMatch ? correoMatch[0] : "No encontrado";

  // 3. Buscar el número de teléfono (7 a 10 dígitos)
  const telefonoMatch = mensaje.match(/\d{8,11}/);
  const telefono = telefonoMatch ? telefonoMatch[0] : "No encontrado";

  // 4. Capturar el comentario (todo después del último dato conocido)
  const comentarioMatch = mensaje.match(/\d{7,10}[,.]?\s*(.+)$/);
  let comentario = comentarioMatch ? comentarioMatch[1] : "No encontrado";

  // Asegurarse de que el comentario no contenga el correo
  if (comentario.includes(correo)) {
    comentario = "No encontrado";
  }

  // Imprimir resultados
  console.log("Nombre:", nombre);
  console.log("Correo:", correo);
  console.log("Teléfono:", telefono);
  console.log("Comentario:", comentario);

  // Mensaje limpio (opcional, elimina datos extraídos)
  const mensajeLimpio = mensaje
    .replace(new RegExp(`(${correo}|\\d{7,10}|^\\w+\\s\\w+[,.\s]*)`, "g"), "")
    .trim();

  console.log("Mensaje limpio:", mensajeLimpio);

  return [nombre, correo, telefono, comentario];
}

