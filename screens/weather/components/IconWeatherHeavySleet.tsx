import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IWeatherIconProps} from '../template/WeatherIcon';

function IconWeatherHeavySleet({size}: IWeatherIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M195 95.7143C195 96.3449 194.99 96.9731 194.969 97.5987C203.917 102.424 210 111.908 210 122.818C210 138.619 197.24 151.429 181.5 151.429H162.54C161.935 149.737 160.749 148.244 159.069 147.276L157.43 146.333C157.666 143.404 156.238 140.464 153.517 138.897C150.779 137.321 147.484 137.573 145.053 139.272L138.262 135.5C138.262 135.5 143.76 131.675 145.121 130.776C147.544 132.434 150.803 132.666 153.517 131.103C156.267 129.519 157.697 126.528 157.42 123.566C159.019 122.628 159.069 122.724 159.069 122.724C162.827 120.56 164.116 115.753 161.944 112C159.772 108.249 154.958 106.954 151.194 109.121C151.194 109.121 151.018 109.257 149.49 110.019C147.072 108.392 143.839 108.174 141.143 109.727C138.415 111.298 136.986 114.255 137.234 117.194C135.833 118.03 129.875 121.647 129.875 121.647C129.875 121.647 129.891 113.943 129.958 112.886C132.574 111.609 134.374 108.93 134.374 105.829C134.374 102.692 132.526 99.9824 129.857 98.7246C129.896 97.3476 129.875 96.8453 129.875 96.8453C129.875 92.5175 126.345 89 122 89C117.657 89 114.125 92.5105 114.125 96.8453C114.125 96.8453 114.145 97.0108 114.132 98.7287C111.468 99.9877 109.626 102.693 109.626 105.829C109.626 108.977 111.486 111.694 114.17 112.946C114.097 115.009 114.125 121.647 114.125 121.647C114.125 121.647 108.251 118.188 106.772 117.141C106.999 114.219 105.571 111.29 102.857 109.727C100.152 108.169 96.901 108.396 94.479 110.042C92.95 109.273 92.8061 109.121 92.8061 109.121C89.0481 106.957 84.229 108.247 82.0564 112C79.8847 115.751 81.1673 120.557 84.9314 122.724C84.9314 122.724 85.2887 122.723 86.5738 123.618C86.3178 126.563 87.7466 129.527 90.4827 131.103C93.2088 132.672 96.4882 132.43 98.9159 130.749C99.7244 131.401 106.772 135.5 106.772 135.5L99.0875 139.372C96.645 137.581 93.276 137.289 90.4827 138.897C87.7645 140.462 86.3362 143.404 86.5707 146.332L84.9314 147.276C83.2527 148.243 82.0665 149.737 81.4615 151.429H69C47.4609 151.429 30 133.9 30 112.278C30 90.6557 47.4609 73.1274 69 73.1274C75.4999 73.1274 81.6283 74.7236 87.0176 77.5468C94.5218 55.6968 115.185 40 139.5 40C170.152 40 195 64.9441 195 95.7143ZM108.995 151.429H114.125V148.353L108.995 151.429ZM129.835 151.429H134.782L129.823 148.573L129.835 151.429Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M118.731 159.869V109.917H117.645C115.837 109.917 114.372 108.455 114.372 106.659C114.372 104.86 115.835 103.402 117.645 103.402H118.731V97.964C118.731 96.1693 120.198 94.7144 122 94.7144C123.806 94.7144 125.269 96.1777 125.269 97.964V103.402H126.355C128.163 103.402 129.628 104.864 129.628 106.659C129.628 108.459 128.166 109.917 126.355 109.917H125.269V159.869H126.355C128.163 159.869 129.628 161.331 129.628 163.127C129.628 164.926 128.166 166.384 126.355 166.384H125.269V171.822C125.269 173.617 123.802 175.071 122 175.071C120.195 175.071 118.731 173.608 118.731 171.822V166.384H117.645C115.837 166.384 114.372 164.922 114.372 163.127C114.372 161.327 115.835 159.869 117.645 159.869H118.731Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M101.929 119.584L145.341 144.56L145.884 143.622C146.788 142.062 148.791 141.529 150.352 142.427C151.915 143.326 152.451 145.318 151.546 146.88L151.003 147.817L155.729 150.536C157.289 151.433 157.82 153.427 156.919 154.982C156.016 156.54 154.012 157.072 152.46 156.179L147.734 153.46L147.191 154.397C146.287 155.957 144.284 156.49 142.723 155.593C141.16 154.693 140.624 152.701 141.529 151.139L142.072 150.202L98.6595 125.226L98.1165 126.164C97.2127 127.723 95.2093 128.257 93.6488 127.359C92.0852 126.459 91.549 124.468 92.454 122.906L92.9971 121.969L88.2713 119.25C86.7115 118.352 86.1808 116.359 87.0817 114.804C87.9845 113.245 89.9881 112.714 91.5405 113.607L96.2663 116.326L96.8093 115.389C97.7131 113.829 99.7165 113.295 101.277 114.193C102.841 115.093 103.377 117.084 102.472 118.646L101.929 119.584Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M145.341 125.226L101.929 150.202L102.472 151.139C103.375 152.699 102.837 154.695 101.277 155.593C99.7133 156.492 97.7143 155.959 96.8093 154.397L96.2662 153.46L91.5405 156.179C89.9807 157.076 87.9826 156.537 87.0817 154.982C86.1789 153.424 86.7188 151.429 88.2712 150.536L92.997 147.817L92.454 146.88C91.5502 145.32 92.0883 143.325 93.6487 142.427C95.2124 141.527 97.2114 142.06 98.1164 143.622L98.6595 144.56L142.072 119.584L141.529 118.646C140.625 117.087 141.163 115.091 142.723 114.193C144.287 113.294 146.286 113.827 147.191 115.389L147.734 116.326L152.46 113.607C154.02 112.71 156.018 113.249 156.919 114.804C157.821 116.362 157.281 118.357 155.729 119.25L151.003 121.969L151.546 122.906C152.45 124.466 151.912 126.461 150.352 127.359C148.788 128.259 146.789 127.726 145.884 126.164L145.341 125.226Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M96.7021 163.499C94.0758 162.646 91.2551 164.083 90.4017 166.71L73.3651 219.143C72.5118 221.769 73.9491 224.59 76.5753 225.443C79.2016 226.297 82.0224 224.859 82.8757 222.233L99.9123 169.8C100.766 167.174 99.3284 164.353 96.7021 163.499ZM156.882 163.499C154.256 162.646 151.435 164.083 150.581 166.71L133.545 219.143C132.691 221.769 134.129 224.59 136.755 225.443C139.381 226.297 142.202 224.859 143.055 222.233L160.092 169.8C160.945 167.174 159.508 164.353 156.882 163.499ZM106.074 180.438C106.927 177.811 109.748 176.374 112.374 177.227C115 178.081 116.437 180.902 115.584 183.528L107.125 209.563C106.272 212.189 103.451 213.626 100.824 212.773C98.1982 211.92 96.761 209.099 97.6143 206.473L106.074 180.438ZM176.765 163.499C174.139 162.646 171.318 164.083 170.465 166.71L157.545 206.473C156.692 209.099 158.129 211.92 160.755 212.773C163.381 213.626 166.202 212.189 167.056 209.563L179.975 169.8C180.829 167.174 179.391 164.353 176.765 163.499ZM70.2697 166.71C71.123 164.083 73.9438 162.646 76.5701 163.499C79.1963 164.353 80.6336 167.174 79.7803 169.8L70.9773 196.892C70.124 199.519 67.3032 200.956 64.677 200.103C62.0507 199.249 60.6134 196.429 61.4668 193.802L70.2697 166.71ZM133.501 174.163C130.875 173.31 128.054 174.747 127.201 177.373L121.862 193.802C121.009 196.429 122.446 199.249 125.073 200.103C127.699 200.956 130.52 199.519 131.373 196.892L136.711 180.463C137.564 177.837 136.127 175.016 133.501 174.163Z"
        fill="#B4F5F2"
      />
    </Svg>
  );
}

export default IconWeatherHeavySleet;
