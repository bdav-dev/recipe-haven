import FloatingActionButton from '@/components/FloatingActionButton';
import Page from '@/components/Page';
import { IngredientContext } from '@/context/IngredientContextProvider';
import { useContext, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CreateIngredientModal from '@/components/ingredient/CreateIngredientModal';
import IngredientListItem from '@/components/ingredient/IngredientListItem';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { includesIgnoreCase, isBlank } from '@/utils/StringUtils';
import { unitToString } from '@/utils/UnitUtils';
import { Ingredient } from '@/types/IngredientTypes';
import EditIngredientModal from '@/components/ingredient/EditIngredientModal';
import NoSearchResultsBadge from '@/components/NoSearchResultsBadge';
import SearchBar from '@/components/SearchBar';
import NoItemsInfo from '@/components/NoItemsInfo';


export default function IngredientsScreen() {
  const theme = useAppTheme();
  const { ingredients } = useContext(IngredientContext);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [editIngredient, setEditIngredient] = useState<Ingredient>();

  const filteredIngredients = useMemo(() => filterIngredients(ingredients, searchText), [ingredients, searchText]);

  function launchEditIngredientModal(ingredient: Ingredient) {
    setEditIngredient(ingredient);
    setIsEditModalVisible(true);
  }

  const areIngredientsEmpty = () => ingredients.length === 0;
  const areFilteredIngredientsEmpty = () => filteredIngredients.length === 0;

  return (
    <Page>
      {
        !areIngredientsEmpty() &&
        <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
      }

      {
        areIngredientsEmpty()
          ? <NoItemsInfo type='ingredients' />
          : (
            areFilteredIngredientsEmpty()
              ? <NoSearchResultsBadge />
              : <FlatList
                data={filteredIngredients}
                style={styles.ingredientList}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={listItemInfo => (
                  <IngredientListItem
                    key={listItemInfo.index}
                    ingredient={listItemInfo.item}
                    editButton={{ onPress: () => launchEditIngredientModal(listItemInfo.item) }}
                  />
                )}
              />
          )
      }

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)}>
        <Ionicons name='add-outline' color={theme.card} size={35} />
      </FloatingActionButton>

      <CreateIngredientModal
        isVisible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
      />

      <EditIngredientModal
        isVisible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        editIngredient={editIngredient}
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
  }
});
