
import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import TextField from "../TextField";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { ThemedText } from "../themed/ThemedText";

type IngredientSearchProps = {
    onSelectIngredient: (ingredient: Ingredient) => void
}

export default function IngredientSearch(props: IngredientSearchProps) {
    const { ingredients } = useContext(IngredientContext);
    const [searchText, setSearchText] = useState('');
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (searchText) {
            setFilteredIngredients(
                ingredients.filter(ingredient =>
                    ingredient.name.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        } else {
            setFilteredIngredients([]);
        }
    }, [searchText, ingredients]);

    return (
        <View style={styles.container}>
            <TextField
                placeholder="Zutat"
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.textField}
            />
            {isFocused && filteredIngredients.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredIngredients}
                        keyExtractor={item => item.ingredientId.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    props.onSelectIngredient(item);
                                    setSearchText(item.name);
                                    setIsFocused(false);
                                }}
                            >
                                <View style={styles.dropdownItem}>
                                    <ThemedText>{item.name}</ThemedText>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    textField: {
        width: "100%",
        fontSize: 24
    },
    dropdown: {
        position: "absolute",
        top: 50,
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        zIndex: 1
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    }
});