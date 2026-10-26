import { Caudex_400Regular } from '@expo-google-fonts/caudex/400Regular';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

// The app is always dark (Madhura's call), so the theme ignores the phone setting.
const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background, text: colors.text },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Caudex_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Fonts load from the app bundle, so this wait is a split second.
  // If they ever fail, the app still opens with system fonts.
  // The brown fill avoids a white flash in the browser while they load.
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" options={{ title: 'Vincent van Dough' }} />
        {/* The tap animation already moves the painting into place, so this screen appears without a slide. */}
        <Stack.Screen name="artwork/[id]" options={{ animation: 'none', title: 'Recipes' }} />
        <Stack.Screen name="recipe/[id]" options={{ title: 'Recipe' }} />
      </Stack>
    </ThemeProvider>
  );
}
