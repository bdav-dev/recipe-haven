import FloatingActionButton from '@/components/FloatingActionButton';
import Page from '@/components/Page';
import { ThemedText } from '@/components/themed/ThemedText';
import { IngredientContext } from '@/context/IngredientContextProvider';
import { useContext, useState } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import CreateIngredientModal from '@/components/ingredient/CreateIngredientModal';
import IngredientListItem from '@/components/ingredient/IngredientListItem';


export default function IngredientsScreen() {
  const { ingredients, setIngredients } = useContext(IngredientContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Page>
      <FloatingActionButton onPress={() => setIsModalVisible(true)} />

      <FlatList
        data={ingredients}
        style={{ padding: 8 }}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
        renderItem={listItemInfo => <IngredientListItem ingredient={listItemInfo.item} />}
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
  image: {
    width: 60,
    height: 60
  }
});
