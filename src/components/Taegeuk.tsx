import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function Taegeuk({ size = 40 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={49} fill="#FFFFFF" stroke="#E1E6EE" strokeWidth={1} />
      <Path
        d="M50,1 A49,49 0 0 1 50,99 A24.5,24.5 0 0 1 50,50 A24.5,24.5 0 0 0 50,1 Z"
        fill="#CD2E3A"
      />
      <Path
        d="M50,1 A49,49 0 0 0 50,99 A24.5,24.5 0 0 0 50,50 A24.5,24.5 0 0 1 50,1 Z"
        fill="#0047A0"
      />
    </Svg>
  );
}
