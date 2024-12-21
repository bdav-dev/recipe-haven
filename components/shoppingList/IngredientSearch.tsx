import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import TextField from "../TextField";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import IngredientSuggestion from "../recipe/IngredientSuggestion";
import CardView from "../themed/CardView";

type IngredientSearchProps = {
    onSelectIngredient: (ingredient: Ingredient) => void
    initalSelectedIngredient?: Ingredient
}

export default function IngredientSearch(props: IngredientSearchProps) {
    const styles = useThemedStyleSheet(createStyles);
    const { ingredients } = useContext(IngredientContext);
    const [searchText, setSearchText] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (searchText && !selectedIngredient) {
            setFilteredIngredients(
                ingredients.filter(ingredient =>
                    ingredient.name.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        } else {
            setFilteredIngredients([]);
        }
    }, [searchText, ingredients, selectedIngredient]);

    const handleSelectIngredient = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setSearchText(ingredient.name);
        setIsFocused(false);
        props.onSelectIngredient(ingredient);
    };

    return (
        <View style={styles.container}>
            <TextField
                placeholder="Zutat suchen..."
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    setSelectedIngredient(null);
                }}
                onFocus={() => setIsFocused(true)}
                style={styles.textField}
            />
            {isFocused && filteredIngredients.length > 0 && (
                <CardView style={styles.dropdown}>
                    <FlatList
                        data={filteredIngredients}
                        keyExtractor={item => item.ingredientId.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectIngredient(item)}
                                style={styles.dropdownItem}
                                activeOpacity={0.7}
                            >
                                <IngredientSuggestion ingredient={item} />
                            </TouchableOpacity>
                        )}
                    />
                </CardView>
            )}
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    container: {
        width: "100%",
        zIndex: 1
    },
    textField: {
        width: "100%",
        fontSize: 16,
        marginBottom: 4
    },
    dropdown: {
        position: "absolute",
        top: 50,
        width: "100%",
        maxHeight: 200,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        zIndex: 2
    },
    dropdownItem: {
        padding: 4
    },
    separator: {
        height: 1,
        backgroundColor: theme.border,
        opacity: 0.5,
        marginVertical: 4
    }
});