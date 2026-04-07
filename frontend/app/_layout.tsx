import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '../components/SafeScreen';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, token, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isCheckingAuth) return;

    const inAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;
    console.log('Auth check:', {
      isSignedIn,
      inAuthScreen,
      segments,
      user,
      token,
    });
    if (!isSignedIn && !inAuthScreen) {
      console.log('Navigating to auth screen');
      router.replace('/(auth)');
    } else if (isSignedIn && inAuthScreen) router.replace('/(tabs)');
  }, [user, token, segments, isCheckingAuth, checkAuth, router]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='(auth)' />
        </Stack>
      </SafeScreen>
      <StatusBar style='dark' />
    </SafeAreaProvider>
  );
}
