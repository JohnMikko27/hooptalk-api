const { js } = require("@eslint/js");

module.exports = {
  // ...js.configs.recommended,
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "warn",
    "quotes": ["warn", "double"],
    "indent": ["warn", 2],
    "semi": ["warn", "always"],
  }
};