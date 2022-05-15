import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IWeatherIconProps} from '../template/WeatherIcon';

function IconWeatherOvercast({size}: IWeatherIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <Path
        d="M194.969 107.599C194.99 106.973 195 106.345 195 105.714C195 74.9441 170.152 50 139.5 50C115.185 50 94.5218 65.6968 87.0176 87.5468C81.6283 84.7236 75.4999 83.1274 69 83.1274C47.4609 83.1274 30 100.656 30 122.278C30 143.9 47.4609 161.429 69 161.429L139.5 161.429C139.525 161.429 139.55 161.429 139.575 161.429H181.5C197.24 161.429 210 148.619 210 132.818C210 121.908 203.917 112.424 194.969 107.599Z"
        fill="#303030"
        fill-opacity="0.7"
      />
    </Svg>
  );
}

export default IconWeatherOvercast;
