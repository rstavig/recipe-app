import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { COLORS } from '../../constants/colors';
import { SafeScreen } from '../../components/SafeScreen';
import { useAuthStore } from '../../store/authStore';

export default function Home() {
  const router = useRouter();
  const { user, token, isCheckingAuth } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.replace('/(auth)/login');
    }
  }, [isCheckingAuth, user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, color: COLORS.text }}>
        Welcome to the Home Screen!
      </Text>
      {user && (
        <Text style={{ fontSize: 18, color: COLORS.text, marginTop: 10 }}>
          Logged in as: {user.username}
        </Text>
      )}
    </View>
  );
}
