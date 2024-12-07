import { StyleSheet, FlatList, View } from "react-native";
import { useContext, useState, useMemo } from "react";
import { IngredientContext } from "@/context/IngredientContextProvider";
import Modal from "../modals/Modal";
import { Ingredient } from "@/types/IngredientTypes";
import IngredientListItem from "../ingredient/IngredientListItem";
import SearchBar from "../SearchBar";
import NoSearchResultsBadge from "@/components/NoSearchResultsBadge";
import NoItemsInfo from "@/components/NoItemsInfo";
import { isBlank } from "@/utils/StringUtils";

type SelectShoppingListIngredientEntriesProps = {
    isVisible: boolean;
    onRequestClose: () => void;
    onIngredientSelected: (ingredient: Ingredient) => void;
}

function filterIngredients(ingredients: Ingredient[], searchText: string) {
    if (isBlank(searchText)) {
        return ingredients;
    }
    return ingredients.filter(ing => 
        ing.name.toLowerCase().includes(searchText.toLowerCase().trim())
    );
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
        <Modal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title="Zutat auswählen"
        >
            <View style={styles.container}>
                {!areIngredientsEmpty && (
                    <SearchBar 
                        searchText={searchText}
                        onSearchTextChange={setSearchText}
                    />
                )}
                
                {areIngredientsEmpty ? (
                    <NoItemsInfo type="ingredients" />
                ) : areFilteredIngredientsEmpty ? (
                    <NoSearchResultsBadge />
                ) : (
                    <FlatList
                        data={filteredIngredients}
                        style={styles.list}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        renderItem={listItemInfo => (
                            <IngredientListItem
                                key={listItemInfo.index}
                                ingredient={listItemInfo.item}
                                onPress={() => {
                                    props.onIngredientSelected(listItemInfo.item);
                                    props.onRequestClose();
                                }}
                            />
                        )}
                    />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%"
    },
    list: {
        padding: 8
    }
});
