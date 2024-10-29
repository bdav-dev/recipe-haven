import { ThemedText } from '@/components/ThemedText';
import { IngredientContext } from '@/context/IngredientContextProvider';
import { getAllIngredients, insertExampleIngredient } from '@/database/IngredientDao';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';


export default function IngredientsScreen() {
  const { ingredients, setIngredients } = useContext(IngredientContext);

  return (
    <View>
      

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
