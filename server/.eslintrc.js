// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    "ecmaVersion": 6
  },
  env: {
    browser: true
  },
  extends: [
    "strongloop"
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // always require semicolons (with warning - green sign)
    "semi": ["warn", "always"],
    // "space-before-function-paren": ["warn", "never"],
    // enforce a maximum line length
    "max-len": ["warn", 140],
    "comma-dangle": ["warn", "never"],
  }
};
