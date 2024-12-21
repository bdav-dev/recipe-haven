import { useState, useContext, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import TextField from "../TextField";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import IngredientSuggestion from "../recipe/IngredientSuggestion";
import { includesIgnoreCase } from "@/utils/StringUtils";

type IngredientSearchProps = {
    onSelectIngredient: (ingredient: Ingredient) => void
    initalSelectedIngredient?: Ingredient
}

export default function IngredientSearch(props: IngredientSearchProps) {
    const styles = useThemedStyleSheet(createStyles);
    const { ingredients } = useContext(IngredientContext);
    const [searchText, setSearchText] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const filteredIngredients = useMemo(() => {
        if (!searchText || selectedIngredient) return [];
        return ingredients.filter(ingredient =>
            includesIgnoreCase(ingredient.name, searchText) || 
            includesIgnoreCase(ingredient.pluralName ?? "", searchText)
        );
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
                <View style={styles.suggestionsContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {filteredIngredients.map((ingredient, index) => (
                            <TouchableOpacity
                                key={ingredient.ingredientId}
                                onPress={() => handleSelectIngredient(ingredient)}
                                style={styles.suggestionItem}
                                activeOpacity={0.7}
                            >
                                <IngredientSuggestion ingredient={ingredient} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
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
    suggestionsContainer: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        maxHeight: 50,
        zIndex: 2
    },
    scrollContent: {
        paddingHorizontal: 4,
        gap: 8
    },
    suggestionItem: {
        height: 40,
        justifyContent: 'center'
    }
});