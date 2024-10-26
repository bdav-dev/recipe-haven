import { ThemedText } from '@/components/ThemedText';
import { getAllIngredients, insertExampleIngredient } from '@/database/IngredientDao';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';


export default function IngredientsScreen() {
  let [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    fetch();
  }, []);

  function fetch() {
    getAllIngredients()
      .then(ing => setIngredients(() => ing));
  }

  function insert() {
    insertExampleIngredient();
  }

  return (
    <View>

      <Button title='fetch' onPress={fetch} />
      <Button title='insert' onPress={insert} />

      <FlatList
        data={ingredients}
        renderItem={item => (
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <ThemedText>{item.item.name}</ThemedText>
            <ThemedText>{item.item.imageSrc}</ThemedText>
          </View>
        )}
      />

    </View>
  );
}



const styles = StyleSheet.create({
  test: {

  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
