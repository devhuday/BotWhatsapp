module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    indent: ["error", 2],
    "max-len": ["error", { code: 80 }],
    "quote-props": ["error", "as-needed"],
    "eol-last": ["error", "always"],
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
}; // Aquí ya está la nueva línea, no escribas nada más después
