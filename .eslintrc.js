module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-unused-vars': 0,
        'react-native/no-inline-styles': 0,
        '@typescript-eslint/no-shadow': 0,
        'eslint-disable react/react-in-jsx-scope': 0,
      },
    },
  ],
};
