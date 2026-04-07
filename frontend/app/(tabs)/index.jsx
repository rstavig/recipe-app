import { View, Text, ScrollView, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { homeStyles } from '../../assets/styles/home.styles';
import Loader from '../../components/Loader';
import { MealAPI } from '../../services/mealAPI';
import { Ionicons } from '@expo/vector-icons';
import CategoryFilter from '../../components/CategoryFilter';
import RecipeCard from '../../components/RecipeCard';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const router = useRouter();
  const { user, token, isCheckingAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [meals, setMeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [apiCategories, randomMeals] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

      setRecipes(transformedMeals);
    } catch (error) {
      console.log('Error loading the data', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error('Error loading category data:', error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !refreshing) return <Loader message='Loading recipes...' />;

  console.log(recipes);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/*  ANIMAL ICONS */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require('../../assets/images/lamb.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require('../../assets/images/chicken.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require('../../assets/images/pork.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>
        <Text style={{ fontSize: 24, color: COLORS.text }}>
          Welcome back to GrubClub!
        </Text>
        {user && (
          <View>
            <View
              style={{ marginTop: 15, marginBottom: 15, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 18, color: COLORS.text, marginTop: 10 }}>
                You are logged in as: {user.username}
              </Text>
            </View>

            {categories.length > 0 && (
              <CategoryFilter
                categories={categories || [0]}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            )}

            <View style={homeStyles.recipesSection}>
              <View style={homeStyles.sectionHeader}>
                <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
              </View>

              {recipes.length > 0 ? (
                <FlatList
                  data={recipes}
                  keyExtractor={(item) => item._id || item.id}
                  renderItem={({ item }) => {
                    // Normalize the recipe object here:
                    const normalizedRecipe = {
                      ...item,
                      id: item.id || item._id, // always provide 'id'
                      sourceType: 'api',
                      image: item.image || item.imageUrl || item.strMealThumb, // fallback for image
                      // Add any other normalization as needed
                    };
                    return <RecipeCard recipe={normalizedRecipe} />;
                  }}
                  numColumns={2}
                  columnWrapperStyle={homeStyles.row}
                  contentContainerStyle={homeStyles.recipesGrid}
                  scrollEnabled={false}
                />
              ) : (
                <View style={homeStyles.emptyState}>
                  <Ionicons
                    name='restaurant-outline'
                    size={64}
                    color={COLORS.textLight}
                  />
                  <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                  <Text style={homeStyles.emptyDescription}>
                    Try a different category
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
