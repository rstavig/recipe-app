import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  API_URL,
  API_RECIPE_URL,
  API_MY_RECIPES_URL,
  API_RECIPES_URL,
} from '../../constants/api';
import { MealAPI } from '../../services/mealAPI';
import Loader from '../../components/Loader';
import { useAuthStore } from '../../store/authStore';
import { Image } from 'expo-image';

import { recipeDetailStyles } from '../../assets/styles/recipe-detail.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const RecipeDetailScreen = () => {
  const params = useLocalSearchParams();
  const recipeId = params.id;
  const sourceType = params.sourceType;

  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const { user, token, isCheckingAuth } = useAuthStore();

  const recipeDataString = params.recipeData || null;

  // Only parse when recipeDataString changes
  const recipeData = useMemo(
    () => (recipeDataString ? JSON.parse(recipeDataString) : null),
    [recipeDataString],
  );

  const checkIfSaved = useCallback(async () => {
    try {
      if (!user || !token) {
        console.error('No user or token found!');
        return;
      }

      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      const favorite = data.favorites.find(
        (fav) => fav.apiId === recipeId || fav.recipeId === recipeId,
      );
      setIsSaved(!!favorite);
      setFavoriteId(favorite ? favorite._id : null);

      // console.log('checkIfSaved:', !!favorite);
    } catch (error) {
      console.error('Error checking if recipe is saved:', error);
    }
  }, [user, token, recipeId]);

  const loadRecipeDetail = useCallback(async () => {
    setLoading(true);
    try {
      if (sourceType === 'api') {
        if (!/^\d+$/.test(recipeId)) {
          console.error('Invalid TheMealDB id:', recipeId);
          setRecipe(null);
          return;
        }

        const mealData = await MealAPI.getMealById(recipeId);

        if (mealData && typeof mealData === 'object') {
          const transformedRecipe = MealAPI.transformMealData(mealData);
          const recipeWithVideo = {
            ...transformedRecipe,
            youtubeUrl: mealData.strYoutube || null,
          };
          console.log('API transformedRecipe:', recipeWithVideo);
          setRecipe(recipeWithVideo);
        } else {
          console.error('mealData is not a valid object:', mealData);
          setRecipe(null);
        }
      } else if (sourceType === 'user') {
        let userRecipe = null;
        if (recipeData) {
          userRecipe =
            typeof recipeData === 'string'
              ? JSON.parse(recipeData)
              : recipeData;

          console.log('userRecipe:', userRecipe);
        } else {
          const response = await fetch(`${API_RECIPE_URL}/${recipeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();

          console.log('data from backend:', recipeId);

          userRecipe = data.recipe;
          console.log('userRecipe from backend:', userRecipe);
        }
        if (!userRecipe) {
          setRecipe(null);
          return;
        }
        let baseRecipe = userRecipe;
        if (userRecipe.recipeId && typeof userRecipe.recipeId === 'object') {
          baseRecipe = { ...userRecipe.recipeId, ...userRecipe };
        }
        const transformedUserRecipe = {
          ...baseRecipe,
          imageUrl: baseRecipe.imageUrl || baseRecipe.image || '', // always set imageUrl
          title: baseRecipe.title || '',
          category: baseRecipe.category || '',
          cookTime: baseRecipe.cookTime || '',
          servings: baseRecipe.servings || '',
          description: baseRecipe.description || '',
          ingredients: Array.isArray(baseRecipe.ingredients)
            ? baseRecipe.ingredients
            : (baseRecipe.ingredients || '').split('\n').filter(Boolean),
          instructions: Array.isArray(baseRecipe.instructions)
            ? baseRecipe.instructions
            : (baseRecipe.instructions || '').split('\n').filter(Boolean),
        };
        console.log('User transformedRecipe:', transformedUserRecipe);
        setRecipe(transformedUserRecipe);
      }
    } catch (error) {
      console.error('Error loading recipe detail:', error);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [recipeId, sourceType, recipeData, token]);

  useEffect(() => {
    // console.log('useEffect triggered', {
    //   recipeId,
    //   sourceType,
    //   recipeDataString,
    //   user,
    //   token,
    //   isCheckingAuth,
    // });

    if (isCheckingAuth) return;
    if (!user || !token) return;

    checkIfSaved();

    checkIfSaved();
    loadRecipeDetail();
  }, [
    recipeId,
    sourceType,
    recipeDataString,
    checkIfSaved,
    recipeData,
    user,
    token,
    isCheckingAuth,
    loadRecipeDetail,
  ]);

  const getYouTubeEmbedUrl = (url) => {
    // example url: https://www.youtube.com/watch?v=mTvlmY4vCug
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleToggleSave = async () => {
    setIsSaving(true);

    try {
      if (isSaved && favoriteId) {
        if (!user || !token) {
          console.error('No user or token found in HTS!');
          return;
        }

        // remove from favorites
        const response = await fetch(`${API_URL}/${favoriteId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to remove recipe');
        // Re-check saved state after removal
        await checkIfSaved();

        setIsSaved(false);
        setFavoriteId(null);
      } else {
        // add to favorites
        const payload =
          sourceType === 'api'
            ? {
                sourceType,
                userId: user._id,
                apiId: String(recipe.id),
                title: recipe.title,
                imageUrl: recipe.imageUrl || recipe.image || '',
                category: recipe.category,
              }
            : {
                sourceType,
                userId: user._id,
                recipeId: recipe.id,
                title: recipe.title,
                imageUrl: recipe.imageUrl || recipe.image || '',
                category: recipe.category,
              };

        const response = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to save recipe');
        // Re-check saved state after removal
        await checkIfSaved();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isCheckingAuth) return <Loader message='Checking authentication...' />;
  if (!user || !token)
    return <Text>You must be logged in to view this page.</Text>;
  if (loading) return <Loader message='Loading recipe details...' />;
  if (!recipe) return <Text>Recipe not found.</Text>;

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            {recipe?.imageUrl ? (
              <Image
                source={{ uri: recipe.imageUrl }}
                style={recipeDetailStyles.headerImage}
                contentFit='cover'
              />
            ) : (
              <View style={recipeDetailStyles.headerImage} />
            )}
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name='arrow-back' size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons
                name={
                  isSaving
                    ? 'hourglass'
                    : isSaved
                      ? 'bookmark'
                      : 'bookmark-outline'
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name='location' size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* QUICK STATS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name='time' size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.cookTime}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name='people' size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {recipe.youtubeUrl && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={['#FF0000', '#CC0000']}
                  style={recipeDetailStyles.sectionIcon}
                >
                  <Ionicons name='play' size={16} color={COLORS.white} />
                </LinearGradient>

                <Text style={recipeDetailStyles.sectionTitle}>
                  Video Tutorial
                </Text>
              </View>

              <View style={recipeDetailStyles.videoCard}>
                <WebView
                  style={recipeDetailStyles.webview}
                  source={{ uri: getYouTubeEmbedUrl(recipe.youtubeUrl) }}
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
                />
              </View>
            </View>
          )}

          {/* INGREDIENTS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + '80']}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name='list' size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {Array.isArray(recipe.ingredients)
                    ? recipe.ingredients.length
                    : 0}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.ingredientsGrid}>
              {Array.isArray(recipe.ingredients) &&
                recipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={recipeDetailStyles.ingredientCard}>
                    <View style={recipeDetailStyles.ingredientNumber}>
                      <Text style={recipeDetailStyles.ingredientNumberText}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={recipeDetailStyles.ingredientText}>
                      {ingredient}
                    </Text>
                    <View style={recipeDetailStyles.ingredientCheck}>
                      <Ionicons
                        name='checkmark-circle-outline'
                        size={20}
                        color={COLORS.textLight}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={['#9C27B0', '#673AB7']}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name='book' size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {Array.isArray(recipe.instructions)
                    ? recipe.instructions.length
                    : 0}
                </Text>
              </View>
            </View>
            <View style={recipeDetailStyles.instructionsContainer}>
              {Array.isArray(recipe.instructions) &&
                recipe.instructions.map((instruction, index) => (
                  <View key={index} style={recipeDetailStyles.instructionCard}>
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primary + 'CC']}
                      style={recipeDetailStyles.stepIndicator}
                    >
                      <Text style={recipeDetailStyles.stepNumber}>
                        {index + 1}
                      </Text>
                    </LinearGradient>
                    <View style={recipeDetailStyles.instructionContent}>
                      <Text style={recipeDetailStyles.instructionText}>
                        {instruction}
                      </Text>
                      <View style={recipeDetailStyles.instructionFooter}>
                        <Text style={recipeDetailStyles.stepLabel}>
                          Step {index + 1}
                        </Text>
                        <TouchableOpacity
                          style={recipeDetailStyles.completeButton}
                        >
                          <Ionicons
                            name='checkmark'
                            size={16}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>

          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + 'CC']}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons name='heart' size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaved ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
