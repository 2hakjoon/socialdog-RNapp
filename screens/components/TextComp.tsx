import React from 'react';
import {Text, TextStyle} from 'react-native';
import {colors} from '../../utils/colors';

interface ITextCompProps {
  text: string;
  color?: string;
  weight?: string;
  size?: number;
  style?: TextStyle;
}

function TextComp({text, color, weight = '400', size, style}: ITextCompProps) {
  return (
    // @ts-ignore
    <Text style={{color, fontSize: size, fontWeight: weight, ...style}}>
      {text}
    </Text>
  );
}

TextComp.defaultProps = {
  color: `${colors.PBlack}`,
  weight: '400',
  size: 14,
};

export default TextComp;
