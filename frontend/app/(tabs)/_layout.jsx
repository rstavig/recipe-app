import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name='home-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='searchScreen'
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons name='search' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='createScreen'
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <Ionicons name='add-circle-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='mystuff'
        listeners={{
          tabPress: () => router.replace('/mystuff'),
        }}
        options={{
          title: 'My Stuff',
          tabBarIcon: ({ color }) => (
            <Ionicons name='person-outline' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
