import FloatingActionButton from '@/components/FloatingActionButton';
import Page from '@/components/Page';
import { IngredientContext } from '@/context/IngredientContextProvider';
import { useContext, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import CreateIngredientModal from '@/components/ingredient/CreateIngredientModal';
import IngredientListItem from '@/components/ingredient/IngredientListItem';
import TextField from '@/components/TextField';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { includesIgnoreCase, isBlank } from '@/utils/StringUtils';
import { unitToString } from '@/utils/UnitUtils';
import { Ingredient } from '@/types/IngredientTypes';


export default function IngredientsScreen() {
  const theme = useAppTheme();

  const { ingredients, setIngredients } = useContext(IngredientContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredIngredients = useMemo(() => filterIngredients(ingredients, searchText), [ingredients, searchText]);

  return (
    <Page>

      <View style={styles.searchBar}>
        <Ionicons name='search-outline' size={25} color={theme.iconSecondary} style={styles.searchBarIcon} />
        <TextField style={{ flex: 1 }} placeholder='Suche' value={searchText} onChangeText={setSearchText} />
      </View>

      <FlatList
        data={filteredIngredients}
        style={styles.ingredientList}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={listItemInfo => <IngredientListItem ingredient={listItemInfo.item} />}
      />

      <FloatingActionButton onPress={() => setIsModalVisible(true)}>
        <Ionicons name='add-outline' color={theme.card} size={35} />
      </FloatingActionButton>

      <CreateIngredientModal
        isVisible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      />

    </Page>
  );
}

function filterIngredients(ingredients: Ingredient[], searchText: string) {
  if (isBlank(searchText)) {
    return ingredients;
  }

  const trimmedSearchText = searchText.trim();

  return ingredients.filter(
    item => (
      includesIgnoreCase(item.name, trimmedSearchText) ||
      includesIgnoreCase(item.pluralName ?? '', trimmedSearchText) ||
      includesIgnoreCase((item.calorificValue?.kcal.toString() ?? '') + " kcal", trimmedSearchText) ||
      includesIgnoreCase(item.calorificValue?.nUnits.toString() ?? '', trimmedSearchText) ||
      includesIgnoreCase(unitToString(item.unit) ?? '', trimmedSearchText)
    )
  );
}

const styles = StyleSheet.create({
  ingredientList: {
    padding: 8
  },
  searchBar: {
    margin: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  searchBarIcon: {
    marginRight: 4
  },
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
