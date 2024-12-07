import { StyleSheet, FlatList, View } from "react-native";
import { useContext, useState, useMemo } from "react";
import { IngredientContext } from "@/context/IngredientContextProvider";
import FullScreenModal from "../modals/FullScreenModal";
import { Ingredient } from "@/types/IngredientTypes";
import IngredientListItem from "../ingredient/IngredientListItem";
import SearchBar from "../SearchBar";
import NoSearchResultsBadge from "@/components/NoSearchResultsBadge";
import NoItemsInfo from "@/components/NoItemsInfo";
import { includesIgnoreCase, isBlank } from "@/utils/StringUtils";
import { unitToString } from "@/utils/UnitUtils";

type SelectShoppingListIngredientEntriesProps = {
    isVisible: boolean;
    onRequestClose: () => void;
    onIngredientSelected: (ingredient: Ingredient) => void;
}


export default function SelectShoppingListIngredientEntries(props: SelectShoppingListIngredientEntriesProps) {
    const { ingredients } = useContext(IngredientContext);
    const [searchText, setSearchText] = useState("");

    const filteredIngredients = useMemo(
        () => filterIngredients(ingredients, searchText),
        [ingredients, searchText]
    );

    const areIngredientsEmpty = ingredients.length === 0;
    const areFilteredIngredientsEmpty = filteredIngredients.length === 0;


    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title="Zutat auswählen"
        >
            <View style={styles.container}>
                {!areIngredientsEmpty && (
                    <View style={styles.searchContainer}>
                        <SearchBar 
                            searchText={searchText}
                            onSearchTextChange={setSearchText}
                        />
                    </View>
                )}
                
                {areIngredientsEmpty ? (
                    <View style={styles.centeredContent}>
                        <NoItemsInfo type="ingredients" />
                    </View>
                ) : areFilteredIngredientsEmpty ? (
                    <View style={styles.centeredContent}>
                        <NoSearchResultsBadge />
                    </View>
                ) : (
                    <FlatList
                        data={filteredIngredients}
                        keyExtractor={(item) => item.ingredientId.toString()}
                        contentContainerStyle={styles.listContent}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        renderItem={({item}) => (
                            <IngredientListItem
                                ingredient={item}
                                selectable={{
                                    onPress: () => {
                                        props.onIngredientSelected(item);
                                        props.onRequestClose();
                                    }
                                }}
                            />
                        )}
                    />
                )}
            </View>
        </FullScreenModal>
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
    container: {
        flex: 1
    },
    searchContainer: {
        padding: 8,
        paddingBottom: 0
    },
    listContent: {
        padding: 8
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});