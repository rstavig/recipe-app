import { useEffect, useState } from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image';
import Loader from '../../components/Loader';

const PurpleScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useAuthStore();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
};

export default PurpleScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'purple',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 30,
//   },
// });
