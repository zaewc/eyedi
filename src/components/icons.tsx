import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

// v1 res/drawable 벡터 아이콘의 pathData 를 그대로 옮김 (픽셀 동일)

export function MenuIcon({ size = 22, color = '#111111' }: { size?: number; color?: string }) {
  const h = (size / 22) * 16;
  return (
    <Svg width={size} height={h} viewBox="0 0 22 16">
      <Path d="M1,0L21,0A1,1 0,0 1,22 1L22,1A1,1 0,0 1,21 2L1,2A1,1 0,0 1,0 1L0,1A1,1 0,0 1,1 0z" fill={color} />
      <Path d="M1,7L21,7A1,1 0,0 1,22 8L22,8A1,1 0,0 1,21 9L1,9A1,1 0,0 1,0 8L0,8A1,1 0,0 1,1 7z" fill={color} />
      <Path d="M1,14L21,14A1,1 0,0 1,22 15L22,15A1,1 0,0 1,21 16L1,16A1,1 0,0 1,0 15L0,15A1,1 0,0 1,1 14z" fill={color} />
    </Svg>
  );
}

export function AddIcon({ size = 24, color = '#111111' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path
        d="M6.863,9.137H1.934C1.615,9.137 1.346,9.028 1.126,8.808C0.907,8.589 0.797,8.319 0.797,8C0.797,7.681 0.907,7.411 1.126,7.192C1.346,6.972 1.615,6.863 1.934,6.863H6.863V1.934C6.863,1.615 6.972,1.346 7.192,1.126C7.411,0.907 7.681,0.797 8,0.797C8.319,0.797 8.589,0.907 8.808,1.126C9.028,1.346 9.137,1.615 9.137,1.934V6.863H14.066C14.385,6.863 14.654,6.972 14.874,7.192C15.094,7.411 15.203,7.681 15.203,8C15.203,8.319 15.094,8.589 14.874,8.808C14.654,9.028 14.385,9.137 14.066,9.137H9.137V14.066C9.137,14.385 9.028,14.654 8.808,14.874C8.589,15.094 8.319,15.203 8,15.203C7.681,15.203 7.411,15.094 7.192,14.874C6.972,14.654 6.863,14.385 6.863,14.066V9.137Z"
        fill={color}
      />
    </Svg>
  );
}

export function QrShowIcon({ size = 26 }: { size?: number }) {
  const s = '#2da9fe';
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      <Path d="M23.953,6.394v-2.21a2.133,2.133 0,0 0,-2.133 -2.133h-2.834" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M2.341,6.484v-2.26a2.177,2.177 0,0 1,2.177 -2.176h2.892" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M23.953,19.222v2.259a2.176,2.176 0,0 1,-2.176 2.176h-2.892" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M2.341,19.222v2.259a2.176,2.176 0,0 0,2.176 2.176h2.892" stroke={s} strokeWidth={2} fill="none" />
      <Path
        d="M15.635,6.717L18.644,6.717A0.944,0.944 0,0 1,19.588 7.661L19.588,10.67A0.944,0.944 0,0 1,18.644 11.614L15.635,11.614A0.944,0.944 0,0 1,14.691 10.67L14.691,7.661A0.944,0.944 0,0 1,15.635 6.717z"
        fill="#7892a0"
      />
      <Path
        d="M7.356,6.717L10.365,6.717A0.944,0.944 0,0 1,11.309 7.661L11.309,10.67A0.944,0.944 0,0 1,10.365 11.614L7.356,11.614A0.944,0.944 0,0 1,6.412 10.67L6.412,7.661A0.944,0.944 0,0 1,7.356 6.717z"
        fill="#7892a0"
      />
      <Path
        d="M7.356,14.386L10.365,14.386A0.944,0.944 0,0 1,11.309 15.33L11.309,18.339A0.944,0.944 0,0 1,10.365 19.283L7.356,19.283A0.944,0.944 0,0 1,6.412 18.339L6.412,15.33A0.944,0.944 0,0 1,7.356 14.386z"
        fill="#7892a0"
      />
      <Path d="M14.691,14.386h4.897v4.897h-4.897z" fill="#7892a0" />
    </Svg>
  );
}

export function QrCaptureIcon({ size = 26 }: { size?: number }) {
  const s = '#2da9fe';
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      <Path d="M23.78,6.766L23.78,4.401A2.279,2.279 0,0 0,21.502 2.122L18.473,2.122" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M2.275,6.862L2.275,4.448A2.326,2.326 0,0 1,4.601 2.122h3.091" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M23.78,18.884v2.414a2.325,2.325 0,0 1,-2.324 2.328h-3.092" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M2.275,18.884v2.414a2.325,2.325 0,0 0,2.325 2.325L7.686,23.623" stroke={s} strokeWidth={2} fill="none" />
      <Path d="M1.5,13.199h23" stroke={s} strokeWidth={2} fill="none" />
    </Svg>
  );
}

export function ClockIcon({ size = 16, color = '#3F434F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Circle cx={8} cy={8} r={7.25} stroke={color} strokeWidth={1.5} fill="none" />
      <Path d="M8,4.3242v3.813l3.023,2.005" stroke={color} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}
