import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const searchScreen = () => {
  const navigation = useNavigation();
  const { name, params } = useRoute();

  // console.log(name);
  // console.log(params);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search Screen</Text>

      {/* <Text>Hello {name}</Text> */}
    </View>
  );
};

export default searchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});
