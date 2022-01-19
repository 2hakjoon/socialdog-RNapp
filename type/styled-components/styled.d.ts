// styled.d.ts
import 'styled-components';
import {MyColors} from '../../utils/colors';

// styled-components안에 들어있는 DefaultTheme 형식 지정해주기
declare module 'styled-components' {
  export interface DefaultTheme extends MyColors {}
}
