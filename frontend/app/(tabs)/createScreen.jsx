import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const GoldScreen = () => {
  const navigation = useNavigation();
  const { name, params } = useRoute();

  // console.log(name);
  // console.log(params);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Screen</Text>

      {/* <Text>Hello {name}</Text> */}
    </View>
  );
};

export default GoldScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});
