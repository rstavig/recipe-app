import { View, Text, Alert, FlatList, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import RecipeCard from '../../../components/RecipeCard';
import { favoritesStyles } from '../../../assets/styles/favorites.styles';
import Loader from '../../../components/Loader';
import { API_URL } from '../../../constants/api';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isCheckingAuth } = useAuthStore();

  console.log(
    'user:',
    user,
    'token:',
    token,
    'isCheckingAuth:',
    isCheckingAuth,
  );

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!user || !token) return;

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log(data);

        // transform the data to match the RecipeCard component's expected format
        const transformedFavorites = data.favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId?._id || favorite.apiId, // use recipeId's _id if available, otherwise use favorite's _id
          title: favorite.recipeId?.title || favorite.title, // use recipeId's title if available, otherwise use favorite's title
          imageUrl: favorite.recipeId?.image || favorite.image,
          // ...other fields as needed
        }));

        setFavorites(transformedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, user, isCheckingAuth]);

  if (isCheckingAuth) return <Loader message='Checking authentication...' />;
  if (!user || !token)
    return <Text>You must be logged in to view this page.</Text>;
  if (loading) return <Loader message='Loading recipe details...' />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>My Favorites</Text>
        <Text>Count: {favorites.length}</Text>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
        </View>
        <View>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MyFavorites;
