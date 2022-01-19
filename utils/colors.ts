import {DefaultTheme} from 'styled-components';

const colors = {
  PBlue: '#2962ff',
  PWthie: '#f5f5f5',
  PBlack: '#212121',
  PGray: '#e0e0e0',
};

export const theme: DefaultTheme = {
  ...colors,
};

export type MyColors = typeof colors;
