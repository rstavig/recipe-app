import { Stack } from 'expo-router';
import { COLORS } from '../../../constants/colors';

export default function MyStuffLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerShown: false,
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name='index' options={{ title: 'My Stuff' }} />
      <Stack.Screen name='myRecipes' options={{ title: 'My Recipes' }} />
      <Stack.Screen name='myFavorites' options={{ title: 'My Favorites' }} />
    </Stack>
  );
}
