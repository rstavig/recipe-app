import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          paddingBottom: insets.bottom,
          height: 60,
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
        name='profileScreen'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name='person-outline' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
