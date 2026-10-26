import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

// Line icons drawn from the design files (24px grid, 2px rounded strokes).

type IconProps = { size?: number; color?: string };

const stroke = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ChevronLeft({ size = 24, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke} stroke={color}>
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

export function ChevronDown({ size = 20, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke} stroke={color}>
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function Refresh({ size = 20, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke} stroke={color}>
      <Path d="M21 12a9 9 0 1 1-3-6.7" />
      <Path d="M21 4v5h-5" />
    </Svg>
  );
}

export function ExternalArrow({ size = 16, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke} stroke={color}>
      <Path d="M7 17L17 7" />
      <Path d="M8 7h9v9" />
    </Svg>
  );
}

export function BrokenImage({ size = 36, color = '#8C8074' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke} strokeWidth={1.75} stroke={color}>
      <Path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <Path d="M3 16l5-5 4 4 3-3 6 6" />
      <Path d="M4 4l16 16" />
    </Svg>
  );
}
