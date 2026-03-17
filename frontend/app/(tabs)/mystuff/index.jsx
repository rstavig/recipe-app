import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/authStore';
import styles from '../../../assets/styles/profile.styles';
import ProfileHeader from '../../../components/ProfileHeader';
import LogoutButton from '../../../components/LogoutButton';

const MyStuffScreen = () => {
  const { token } = useAuthStore();
  console.log('My Stuff screen: token =', token);

  const router = useRouter();

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <Text style={styles.text}>My Stuff Screen</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          title='My Recipes'
          onPress={() => router.push('/mystuff/myRecipes')}
          style={styles.myFavoritesButton}
          titleStyle={styles.myFavoritesButtonText}
        >
          <Text style={styles.myFavoritesButtonText}>My Recipes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          title='My Favorites'
          onPress={() => router.push('/mystuff/myFavorites')}
          style={styles.myFavoritesButton}
          titleStyle={styles.myFavoritesButtonText}
        >
          <Text style={styles.myFavoritesButtonText}>My Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyStuffScreen;
