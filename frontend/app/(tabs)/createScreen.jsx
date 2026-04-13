import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuthStore } from '../../store/authStore';
import { API_RECIPE_URL } from '../../constants/api';

const CATEGORIES = [
  'Beef',
  'Chicken',
  'Dessert',
  'Family Favorite',
  'Quick Lunch',
  // ...populate from API/user/custom as needed
];

export default function CreateScreen() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Add/Remove ingredient/instruction lines
  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (text, idx) => {
    const arr = [...ingredients];
    arr[idx] = text;
    setIngredients(arr);
  };
  const removeIngredient = (idx) =>
    setIngredients(ingredients.filter((_, i) => i !== idx));

  const addInstruction = () => setInstructions([...instructions, '']);
  const updateInstruction = (text, idx) => {
    const arr = [...instructions];
    arr[idx] = text;
    setInstructions(arr);
  };
  const removeInstruction = (idx) =>
    setInstructions(instructions.filter((_, i) => i !== idx));

  // Submit handler (to be implemented)
  const handleSubmit = async () => {
    if (
      !title ||
      !category ||
      !prepTime ||
      !cookTime ||
      !servings ||
      !description ||
      !ingredients ||
      !instructions ||
      !imageUrl
    ) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_RECIPE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          prepTime: parseInt(prepTime),
          cookTime: parseInt(cookTime),
          servings: parseInt(servings),
          description,
          ingredients,
          instructions,
          imageUrl,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create recipe');
      }

      console.log('Submitting recipe:', data);
      Alert.alert('Submitted', 'Your recipe has been created!');
    } catch (error) {
      console.error('Error submitting recipe:', error);
      Alert.alert('Error', error.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <Text style={styles.header}>Create Recipe</Text>
        <TextInput
          style={styles.input}
          placeholder='Title'
          value={title}
          onChangeText={setTitle}
        />
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.input}
        >
          {CATEGORIES.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder='Prep Time (minutes)'
          value={prepTime}
          onChangeText={setPrepTime}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Cook Time (minutes)'
          value={cookTime}
          onChangeText={setCookTime}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Servings'
          value={servings}
          onChangeText={setServings}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.sectionHeader}>Ingredients</Text>
        {ingredients.map((ing, idx) => (
          <View key={idx} style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={`Ingredient ${idx + 1}`}
              value={ing}
              onChangeText={(text) => updateIngredient(text, idx)}
            />
            <TouchableOpacity onPress={() => removeIngredient(idx)}>
              <Text style={styles.removeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addIngredient}>
          <Text style={styles.addBtn}>+ Add Ingredient</Text>
        </TouchableOpacity>
        <Text style={styles.sectionHeader}>Instructions</Text>
        {instructions.map((inst, idx) => (
          <View key={idx} style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={`Step ${idx + 1}`}
              value={inst}
              onChangeText={(text) => updateInstruction(text, idx)}
            />
            <TouchableOpacity onPress={() => removeInstruction(idx)}>
              <Text style={styles.removeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addInstruction}>
          <Text style={styles.addBtn}>+ Add Step</Text>
        </TouchableOpacity>
        {/* Image will go here */}
        <Text style={styles.sectionHeader}>
          Image Logic will go here---for now just use URL
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Image URL'
          value={imageUrl}
          onChangeText={setImageUrl}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  addBtn: { color: '#4ECDC4', fontWeight: 'bold', marginBottom: 12 },
  removeBtn: { color: 'red', fontSize: 20, marginLeft: 8 },
  scrollViewStyle: { flex: 1 },
});
