module.exports = {
  overrides: [
    {
      files: ['.prettierrc', '.eslintrc'],
      options: {
        parser: 'json',
      },
    },
  ],
  singleQuote: true,
  parser: 'typescript',
  printWidth: 100,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
};
