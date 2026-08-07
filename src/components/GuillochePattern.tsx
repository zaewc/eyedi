import React, { useMemo } from 'react';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  color: string;
  opacity?: number;
}

function wavePath(w: number, h: number, cy: number, amp: number, freq: number, phase: number): string {
  const steps = 48;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = cy + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp;
    d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

export default function GuillochePattern({ width, height, color, opacity = 0.5 }: Props) {
  const paths = useMemo(() => {
    const lines: { d: string; o: number }[] = [];
    const rows = 26;
    for (let r = 0; r < rows; r++) {
      const cy = (height / (rows - 1)) * r;
      const amp = 6 + (r % 5) * 2;
      const freq = 3 + (r % 3);
      const phase = (r * Math.PI) / 5;
      lines.push({ d: wavePath(width, height, cy, amp, freq, phase), o: 0.6 });
    }
    return lines;
  }, [width, height]);

  return (
    <Svg width={width} height={height} style={{ position: 'absolute', opacity }}>
      <Defs>
        <RadialGradient id="guil-glow" cx="70%" cy="42%" r="55%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {paths.map((p, i) => (
        <Path key={i} d={p.d} stroke={color} strokeWidth={0.6} fill="none" strokeOpacity={0.35} />
      ))}
      <Circle cx={width * 0.7} cy={height * 0.42} r={width * 0.28} fill="url(#guil-glow)" />
    </Svg>
  );
}
