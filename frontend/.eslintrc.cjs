module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    'unused-imports/no-unused-imports': 'error',
  },
  plugins: ['vue', 'prettier', '@typescript-eslint', 'import', 'unused-imports'],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './frontend']],
        extensions: ['.ts', '.js', '.vue']
      },
    },
  }
}