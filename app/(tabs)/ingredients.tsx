import FloatingActionButton from '@/components/FloatingActionButton';
import Page from '@/components/Page';
import { ThemedText } from '@/components/themed/ThemedText';
import { IngredientContext } from '@/context/IngredientContextProvider';
import { useContext, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CreateIngredientModal from '@/components/ingredient/CreateIngredientModal';


export default function IngredientsScreen() {
  const { ingredients, setIngredients } = useContext(IngredientContext);

  const [isModalVisible, setIsModalVisible] = useState(false);



  return (
    <Page>
      <FloatingActionButton onPress={() => setIsModalVisible(true)} />


      <FlatList
        data={ingredients}
        renderItem={item => (
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <ThemedText>{item.item.ingredientId}</ThemedText>
            <ThemedText>{item.item.name}</ThemedText>
            <ThemedText>{item.item.pluralName ?? "null"}</ThemedText>
            <ThemedText>{item.item.imageSrc ?? "null"}</ThemedText>
            <ThemedText>{item.item.unit}</ThemedText>
            <ThemedText>{item.item.kcalPerUnit ?? "null"}</ThemedText>
          </View>
        )}
      />

      <CreateIngredientModal
          isVisible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
      />

    </Page>
  );
}


const styles = StyleSheet.create({
  textInput: {
    width: 100
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
