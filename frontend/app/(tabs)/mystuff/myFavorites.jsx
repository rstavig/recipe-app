import { View, Text, Alert, FlatList, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import RecipeCard from '../../../components/RecipeCard';
import { favoritesStyles } from '../../../assets/styles/favorites.styles';
import Loader from '../../../components/Loader';
import { API_FAVORITES_URL } from '../../../constants/api';

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
        const response = await fetch(`${API_FAVORITES_URL}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log(data.favorites);

        // transform the data to match the RecipeCard component's expected format
        const transformedFavorites = data.favorites.map((favorite) => {
          const isUserRecipe = favorite.sourceType === 'user';
          return {
            ...favorite,
            // For user recipes, use the actual recipe's id (could be populated or just an ObjectId string)
            id: isUserRecipe
              ? typeof favorite.recipeId === 'object'
                ? favorite.recipeId._id
                : favorite.recipeId
              : favorite.apiId,
            title: isUserRecipe
              ? typeof favorite.recipeId === 'object'
                ? favorite.recipeId.title
                : favorite.title
              : favorite.title,
            image: isUserRecipe
              ? typeof favorite.recipeId === 'object'
                ? favorite.recipeId.image || favorite.recipeId.imageUrl || ''
                : favorite.image || favorite.imageUrl || ''
              : favorite.imageUrl || '',
            imageUrl: isUserRecipe
              ? typeof favorite.recipeId === 'object'
                ? favorite.recipeId.imageUrl || favorite.recipeId.image || ''
                : favorite.imageUrl || favorite.image || ''
              : favorite.imageUrl || '',
            sourceType: favorite.sourceType,
            // ...other fields as needed
          };
        });

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
            renderItem={({ item }) => {
              // No further normalization needed, just pass item
              console.log('Rendering RecipeCard with:', item);
              return <RecipeCard recipe={item} />;
            }}
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
