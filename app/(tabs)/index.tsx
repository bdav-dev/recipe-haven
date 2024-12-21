import FloatingActionButton from '@/components/FloatingActionButton';
import NoItemsInfo from '@/components/NoItemsInfo';
import NoSearchResultsBadge from '@/components/NoSearchResultsBadge';
import Page from '@/components/Page';
import CreateRecipeModal from '@/components/recipe/CreateRecipeModal';
import RecipeDetailModal from '@/components/recipe/RecipeDetailModal';
import EditRecipeModal from '@/components/recipe/EditRecipeModal';
import RecipeListItem from '@/components/recipe/RecipeListItem';
import SearchBar from '@/components/SearchBar';
import FrontendRecipeHolderContextProvider from '@/context/FrontendRecipeHolderContextProvider';
import { RecipeContext } from '@/context/RecipeContextProvider';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Recipe } from '@/types/RecipeTypes';
import { difficultyToString } from '@/utils/DifficultyUtils';
import { includesIgnoreCase, isBlank } from '@/utils/StringUtils';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { deleteRecipe } from '@/data/dao/RecipeDao';


export default function RecipesScreen() {
    const theme = useAppTheme();
    const { recipes, setRecipes } = useContext(RecipeContext);

    const [isCreateRecipeModalVisible, setCreateRecipeModalVisible] = useState(false);
    const [isEditRecipeModalVisible, setEditRecipeModalVisible] = useState(false);

    const [editRecipe, setEditRecipe] = useState<Recipe>();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const [searchText, setSearchText] = useState('');
    const filteredRecipes = useMemo(() => filterRecipes(recipes, searchText), [recipes, searchText]);

    const areRecipesEmpty = () => recipes.length === 0;
    const areFilteredRecipesEmpty = () => filteredRecipes.length === 0;

    function launchEditRecipeModal(recipe: Recipe) {
        setEditRecipe(recipe);
        setTimeout(
            () => setEditRecipeModalVisible(true),
            500
        );
    }

    function removeRecipe(recipeToDelete: Recipe) {
        setRecipes(r => r.filter(recipe => recipe.recipeId != recipeToDelete.recipeId));
        deleteRecipe(recipeToDelete);
    }

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
                                    <TouchableOpacity onPress={() => setSelectedRecipe(listItemInfo.item)}>
                                        <RecipeListItem
                                            key={listItemInfo.index}
                                            recipe={listItemInfo.item}
                                        />
                                    </TouchableOpacity>
                                )}
                                ListFooterComponent={<View style={{ height: 100 }} />}
                            />
                    )
            }

            {
                selectedRecipe != undefined &&
                <RecipeDetailModal
                    onDelete={() => removeRecipe(selectedRecipe)}
                    onEdit={() => {
                        const sel = selectedRecipe;
                        setSelectedRecipe(null);
                        if (sel) launchEditRecipeModal(sel);
                    }}
                    recipe={selectedRecipe}
                    isVisible={selectedRecipe !== null}
                    onRequestClose={() => setSelectedRecipe(null)}
                />
            }


            <FrontendRecipeHolderContextProvider>
                <CreateRecipeModal isVisible={isCreateRecipeModalVisible} onRequestClose={() => setCreateRecipeModalVisible(false)} />
                {
                    isEditRecipeModalVisible &&
                    <EditRecipeModal isVisible={isEditRecipeModalVisible} onRequestClose={() => { setEditRecipeModalVisible(false); setEditRecipe(undefined); }} editRecipe={editRecipe} />
                }
            </FrontendRecipeHolderContextProvider>

            <FloatingActionButton onPress={() => setCreateRecipeModalVisible(true)}>
                <Ionicons name='add-outline' color={theme.card} size={35} />
            </FloatingActionButton>
        </Page>
    );
}

function filterRecipes(recipes: Recipe[], searchText: string) {
    const sortedRecipes = recipes.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) {
            return -1;
        } else if (!a.isFavorite && b.isFavorite) {
            return 1;
        }
        return 0;
    });

    if (isBlank(searchText)) {
        return sortedRecipes;
    }

    const trimmedSearchText = searchText.trim();

    return sortedRecipes.filter(
        item => (
            includesIgnoreCase(item.title, trimmedSearchText) ||
            includesIgnoreCase(item.difficulty ? difficultyToString(item.difficulty) : '', trimmedSearchText) ||
            item.tags.some(tag => includesIgnoreCase(tag, trimmedSearchText)) ||
            item.ingredientsForOnePortion.some(ingredient => includesIgnoreCase(ingredient.ingredient.name, trimmedSearchText)) ||
            item.ingredientsForOnePortion.some(ingredient => includesIgnoreCase(ingredient.ingredient.pluralName ?? '', trimmedSearchText))
        )
    );
}

const styles = StyleSheet.create({
    recipeList: {
        padding: 8
    }
});

