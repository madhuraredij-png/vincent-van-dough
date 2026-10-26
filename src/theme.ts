// Design tokens from the approved screens (canvas: "Vincent van Dough screens").
// Every color, font and size the screens use lives here, so a change in the
// design is a change in one place.

export const colors = {
  background: '#17130F', // warm dark brown page
  text: '#F4EEE6',
  textMuted: '#B8AC9E',
  surface: '#241E18', // hover row tint, skeleton cards
  border: '#2A231C', // ingredient dividers, step number circles
  brown: '#4A3424', // refresh and "See the full recipe" buttons
  iris: '#B39DDB', // main buttons, app name, hovered recipe name
  onIris: '#17130F',
  toast: '#F4EEE6',
  dashed: '#4A3F33',
} as const;

// The antique gold gilt frame (option B, picked by Madhura).
export const gilt = {
  gradient: ['#3A2A12', '#9C7A3C', '#5E4620', '#B8934E', '#5A421C', '#8E6C32', '#33240E'],
  inner: '#4A3618',
  lip: '#9C7A3C',
  thickness: 16,
} as const;

export const fonts = {
  serif: 'Caudex_400Regular',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

// Timings for the tap animation, approved as drafted.
export const motion = {
  frameIn: 600,
  grow: 1200,
  frameOut: 600,
} as const;
