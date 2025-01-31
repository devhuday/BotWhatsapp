import * as bot from "./Textbot.mjs";
export const ENDFLOW = "*Si te gustaría ver otras opciones presiona el boton.*";
export const ENDFLOW_OPTION = ["Volver al inicio ✅"];

export const RESPONSES = {
  "holax": {
    body: bot.welcome.message,
    question: bot.welcome.question,
    options: bot.welcome.option,
    media: ["welcome", "image"]
  },
  "cotizacion": {
    body: bot.nameandnumber.message
  },
  "mantenimiento": {
    body: bot.nameandnumber.message
  },
  "cotizar": {
    question: bot.cotizacion.message,
    options: bot.cotizacion.option,
    list: "on"
  },
  "citaManteni": {
    body: bot.mantenimientoMens.message
  },
  "sistema on grid": {
    question: bot.cotizacion_grid.message,
    options: bot.cotizacion_grid.option
  },
  "sistema off grid": {
    question: bot.cotizacion_offgrid.message,
    options: bot.cotizacion_offgrid.option
  },
  "sistema hibrido": {
    body: bot.cotizacion_hibrido.message,
    question: bot.cotizacion_hibrido.question,
    options: bot.cotizacion_hibrido.option,
    media: ["consumo", "image"]
  },
  "residencial 🏠": {
    body: bot.Residencial_cotizar.message,
    question: bot.Residencial_cotizar.question,
    options: bot.Residencial_cotizar.option,
    media: ["consumo", "image"]
  },
  "comercial 🏢": {
    body: bot.Residencial_coti_comercial.message,
    question: bot.Residencial_coti_comercial.question,
    options: bot.Residencial_coti_comercial.option,
    media: ["consumo", "image"]
  },
  "industrial 🏭": {
    body: bot.Residencial_coti_mayor.message,
    contact: ["name", "number"]
  },
  "sistemas aislados": {
    body: bot.offgrid_pdf.message,
    media: ["catalogo", "documents"],
    question: ENDFLOW,
    options: ENDFLOW_OPTION,
    alerta: "on"
  },
  "aire hibrido solar": {
    body: bot.offgrid_pdf.message,
    media: ["aire_solar", "documents"],
    question: ENDFLOW,
    options: ENDFLOW_OPTION,
    alerta: "on"
  },
  "ahorro hasta": {
    body: bot.Residencial_coti_pdf.message,
    media: ["cotizacion_", "documents"],
    question: ENDFLOW,
    options: ENDFLOW_OPTION,
    alerta: "on",
    credito: "on"
  },
  "Ok, gracias": {
    body: bot.Residencial_coti_mayor.message,
    contact: ["name", "number"]
  },
  "agendar cita 🗓️": {
    body: bot.agendar.message,
    media: ["nic", "image"]
  },
  "panelc": {
    body: bot.panel.message
  }
};

export const RESPONSE_FLEX = {
  "ahorro hasta": {
    body: bot.Residencial_coti_pdf.message,
    media: ["cotizacion_", "documents"],
    question: ENDFLOW, options: ENDFLOW_OPTION,
    alerta: "on",
    credito: "on"
  }
};

export const RESPONSE_IA = {
  "no estoy seguro": { responseIA: "no estoy seguro sobre que tipo de sistema solar utilizar on grid o off grid", action: "text" },
  "desconozco estos temas": { responseIA: "no tengo conocimientos de sistemas off grid, on grid o hibridos, podrias explicarme", action: "cotizar" }
};

export const FOOTER = "";
