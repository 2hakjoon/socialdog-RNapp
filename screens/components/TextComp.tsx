import React from 'react';
import {Text} from 'react-native';
import {theme} from '../../utils/colors';

interface ITextCompProps {
  text: string;
  color?: string;
  weight?: string;
  size?: number;
}

function TextComp({text, color = 'red', weight = '400', size}: ITextCompProps) {
  // @ts-ignore
  return (
    <Text style={{color, fontSize: size, fontWeight: weight}}>{text}</Text>
  );
}

TextComp.defaultProps = {
  color: `${theme.PBlack}`,
  weight: '400',
  size: 14,
};

export default TextComp;
