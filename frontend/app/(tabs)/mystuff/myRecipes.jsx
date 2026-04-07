import { View, Text, Alert, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import RecipeCard from '../../../components/RecipeCard';
import Loader from '../../../components/Loader';
import { recipeDetailStyles } from '../../../assets/styles/recipe-detail.styles';
import { API_MY_RECIPES_URL } from '../../../constants/api';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
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
    const fetchMyRecipes = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_MY_RECIPES_URL}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch recipes');
        }
        setRecipes(data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        Alert.alert('Error', error.message || 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  // In MyRecipes.jsx, before passing to RecipeCard:
  const normalizedRecipes = recipes.map((r) => ({
    ...r,
    id: r._id || r.id, // ensure 'id' is present
    sourceType: 'user', // or whatever is appropriate
  }));

  console.log('normalizedRecipes:', normalizedRecipes);

  return (
    <View>
      <Text>My Recipes</Text>
      <Text>Count: {recipes.length}</Text>

      {recipes.length === 0 ? (
        <Text>You have not created any recipes yet.</Text>
      ) : (
        <View style={recipeDetailStyles.container}>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // Detect if it's an API or user recipe
              const isApiRecipe = item.idMeal || item.sourceType === 'api'; // or any unique API field
              const isUserRecipe = item._id && !item.idMeal; // or any unique user field

              // Normalize the recipe object before passing to RecipeCard
              const normalizedRecipe = {
                ...item,
                id: item.id || item._id || item.idMeal, // always provide 'id'
                sourceType: isApiRecipe ? 'api' : 'user',
                image: item.image || item.imageUrl || item.strMealThumb, // fallback for image
                // Add any other normalization as needed
              };

              // console.log('Rendering RecipeCard with:', normalizedRecipe);

              return <RecipeCard recipe={normalizedRecipe} />;
            }}
            numColumns={2}
            columnWrapperStyle={recipeDetailStyles.row}
            contentContainerStyle={recipeDetailStyles.recipesGrid}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

export default MyRecipes;
