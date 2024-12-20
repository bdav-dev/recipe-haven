import FloatingActionButton from '@/components/FloatingActionButton';
import NoItemsInfo from '@/components/NoItemsInfo';
import NoSearchResultsBadge from '@/components/NoSearchResultsBadge';
import Page from '@/components/Page';
import CreateRecipeModal from '@/components/recipe/CreateRecipeModal';
import RecipeListItem from '@/components/recipe/RecipeListItem';
import SearchBar from '@/components/SearchBar';
import FrontendRecipeHolderContextProvider from '@/context/EditRecipeContextProvider';
import { RecipeContext } from '@/context/RecipeContextProvider';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Recipe } from '@/types/RecipeTypes';
import { difficultyToString } from '@/utils/DifficultyUtils';
import { includesIgnoreCase, isBlank } from '@/utils/StringUtils';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';


export default function RecipesScreen() {
  const theme = useAppTheme();
  const { recipes } = useContext(RecipeContext);

  const [isCreateRecipeModalVisible, setCreateRecipeModalVisible] = useState(false);

  const [searchText, setSearchText] = useState('');
  const filteredRecipes = useMemo(() => filterRecipes(recipes, searchText), [recipes, searchText]);

  const areRecipesEmpty = () => recipes.length === 0;
  const areFilteredRecipesEmpty = () => filteredRecipes.length === 0;

  return (
    <Page>
      {
        !areRecipesEmpty() &&
        <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
      }

      {
        areRecipesEmpty()
          ? <NoItemsInfo type='recipes' />
          : (
            areFilteredRecipesEmpty()
              ? <NoSearchResultsBadge />
              : <FlatList
                data={filteredRecipes}
                style={styles.recipeList}
                ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                renderItem={listItemInfo => (
                  <RecipeListItem
                    key={listItemInfo.index}
                    recipe={listItemInfo.item}
                  />
                )}
              />
          )
      }

      <FrontendRecipeHolderContextProvider>
        <CreateRecipeModal isVisible={isCreateRecipeModalVisible} onRequestClose={() => setCreateRecipeModalVisible(false)} />
      </FrontendRecipeHolderContextProvider>
      
      <FloatingActionButton onPress={() => setCreateRecipeModalVisible(true)}>
        <Ionicons name='add-outline' color={theme.card} size={35} />
      </FloatingActionButton>

    </Page>
  );
}

function filterRecipes(recipes: Recipe[], searchText: string) {
  if (isBlank(searchText)) {
    return recipes;
  }

  const trimmedSearchText = searchText.trim();

  return recipes.filter(
    item => (
      includesIgnoreCase(item.title, trimmedSearchText) ||
      includesIgnoreCase(item.difficulty ? difficultyToString(item.difficulty) : '', trimmedSearchText)
    )
  );
}

const styles = StyleSheet.create({
  recipeList: {
    padding: 8
  },




});


