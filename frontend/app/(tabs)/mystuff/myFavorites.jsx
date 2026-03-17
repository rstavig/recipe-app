import { View, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';

const MyFavorites = () => {
  const { token } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // transform the data to match the RecipeCard component's expected format
        const transformedFavorites = data.favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavorites(transformedFavorites);

        console.log(favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, favorites]);

  return (
    <View>
      <Text>My Favorites</Text>
      <Text>Count: {favorites.length}</Text>
      {favorites.map((item) => (
        <Text key={item._id}>
          {item.sourceType} - {item.recipeId} - {item.recipeName}
        </Text>
      ))}
    </View>
  );
};

export default MyFavorites;
