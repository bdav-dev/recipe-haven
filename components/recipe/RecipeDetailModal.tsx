import { Recipe } from "@/types/RecipeTypes";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import FullScreenModal from "../modals/FullScreenModal";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { useContext, useState } from "react";
import DifficultyLabel from "./DifficultyLabel";
import DurationLabel from "./DurationLabel";
import AutoColorBadge from "../AutoColorBadge";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import RecipeIngredientListItem from "./RecipeIngredientListItem";
import TextField from "../TextField";
import { isPositiveInteger } from "@/utils/MathUtils";
import Star from "./Star";
import { RecipeContext } from "@/context/RecipeContextProvider";
import { deleteRecipe, setRecipeFavorite } from "@/data/dao/RecipeDao";
import CalorieLabel from "./CalorieLabel";
import { getTotalKcalPerPortion } from "@/utils/RecipeUtils";
import Button from "../Button";
import { addIngredientsToBulk } from "@/data/dao/ShoppingListDao";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";

type RecipeDetailModalProps = {
    recipe: Recipe | null;
    isVisible: boolean;
    onRequestClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function RecipeDetailModal({ recipe, isVisible, onRequestClose, onEdit, onDelete }: RecipeDetailModalProps) {
    const { setRecipes } = useContext(RecipeContext);
    const { setShoppingList } = useContext(ShoppingListContext);

    const styles = useThemedStyleSheet(createStyles);
    const [portionMultiplier, setPortionMultiplier] = useState("1");

    if (!recipe) return null;

    const isAtMinPortions = portionMultiplier === "1";

    const kcalPerPortion = getTotalKcalPerPortion(recipe);

    const handleFavoriteToggle = () => {
        recipe.isFavorite = !recipe.isFavorite;
        setRecipes(recipes => [...recipes]);
        setRecipeFavorite(recipe.recipeId, recipe.isFavorite);
    };

    const handleIncreasePortions = () => {
        const newValue = parseInt(portionMultiplier) + 1;
        setPortionMultiplier(newValue.toString());
    };

    const handleDecreasePortions = () => {
        const newValue = Math.max(1, parseInt(portionMultiplier) - 1);
        setPortionMultiplier(newValue.toString());
    };

    const handleAddToShoppingList = async () => {
        if (!recipe) return;
        
        try {
            const newItems = await addIngredientsToBulk(scaledIngredients);
            
            setShoppingList(current => {
                const updatedIngredientItems = [...current.ingredientItems];
                
                newItems.forEach(newItem => {
                    const existingIndex = updatedIngredientItems.findIndex(item => 
                        item.shoppingListIngredientItemId === newItem.shoppingListIngredientItemId
                    );
                    
                    if (existingIndex >= 0) {
                        updatedIngredientItems[existingIndex] = newItem;
                    } else {
                        updatedIngredientItems.push(newItem);
                    }
                });
                
                return {
                    ...current,
                    ingredientItems: updatedIngredientItems
                };
            });
            
            Alert.alert('Erfolg', 'Zutaten wurden zur Einkaufsliste hinzugefügt.');
        } catch (error) {
            console.log('Failed to add ingredients to shopping list:', error);
            Alert.alert('Fehler', 'Zutaten konnten nicht zur Einkaufsliste hinzugefügt werden.');
        }
    };

    const multiplier = isPositiveInteger(+portionMultiplier) ? +portionMultiplier : 1;
    const scaledIngredients: QuantizedIngredient[] = recipe.ingredientsForOnePortion.map(ing => ({
        ...ing,
        amount: ing.amount * multiplier
    }));
    const amountOfRecipeInfo = (
        (recipe.preparationTime ? 1 : 0)
        + (recipe.difficulty != undefined ? 1 : 0)
        + (kcalPerPortion != undefined ? 1 : 0)
    );


    function triggerDelete() {
        Alert.alert('Rezept löschen', 'Möchtest du dieses Rezept wirklich löschen?', [
            {
                text: 'Abbrechen'
            },
            {
                text: 'Löschen',
                onPress: () => { onDelete(); onRequestClose(); },
                style: "destructive"
            }
        ]);
    }

    return (
        <FullScreenModal
            isVisible={isVisible}
            onRequestClose={onRequestClose}
            title={recipe.title}
            rightButton={{
                title: 'Bearbeiten',
                onPress: onEdit
            }}
        >
            <View style={styles.content}>
                <CardView>
                    {recipe.imageSrc && (
                        <Image source={{ uri: recipe.imageSrc }} style={styles.detailImage} />
                    )}

                    <View style={styles.titleContainer}>
                        <ThemedText type="midtitle" style={styles.title}>
                            {recipe.title}
                        </ThemedText>
                        <Star filled={recipe.isFavorite} onPress={handleFavoriteToggle} />
                    </View>

                    <View style={styles.infoContainer}>
                        {recipe.preparationTime && (
                            <DurationLabel duration={recipe.preparationTime} />
                        )}
                        {recipe.difficulty != undefined && (
                            <DifficultyLabel difficulty={recipe.difficulty} />
                        )}
                        {kcalPerPortion != undefined && (
                            <CalorieLabel kiloCalories={kcalPerPortion} />
                        )}
                    </View>

                    {recipe.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {recipe.tags.map((tag, index) => (
                                <AutoColorBadge key={index} text={tag} />
                            ))}
                        </View>
                    )}
                </CardView>

                {
                    recipe.description &&
                    <CardView title="Beschreibung">
                        <View style={styles.descriptionContainer}>
                            <ThemedText>{recipe.description}</ThemedText>
                        </View>
                    </CardView>
                }

                <CardView title="Zutaten">
                    <View style={styles.portionContainer}>
                        <ThemedText>Zutaten für </ThemedText>
                        <View style={styles.portionControlContainer}>
                            <Button
                                style={styles.portionButton}
                                ionicon="chevron-down-outline"
                                onPress={handleDecreasePortions}
                                disabled={isAtMinPortions}
                            />
                            <TextField
                                style={styles.portionInput}
                                keyboardType="numeric"
                                value={portionMultiplier}
                                onChangeText={setPortionMultiplier}
                                isErroneous={!isPositiveInteger(+portionMultiplier)}
                                readOnly={true}
                            />
                            <Button
                                style={styles.portionButton}
                                ionicon="chevron-up-outline"
                                onPress={handleIncreasePortions}
                            />
                        </View>
                        <ThemedText> Portion(en)</ThemedText>
                    </View>

                    {
                        scaledIngredients.map((ingredient, index) => (
                            <RecipeIngredientListItem
                                key={index}
                                recipeIngredient={ingredient}
                            />
                        ))
                    }
                    <Button
                        title="Zur Einkaufsliste hinzufügen"
                        ionicon="cart-outline"
                        style={styles.addToCartButton}
                        onPress={handleAddToShoppingList}
                    />
                </CardView>

                <Button
                    ionicon="trash-outline"
                    title="Rezept löschen"
                    type="destructive"
                    onPress={triggerDelete}
                />

            </View>
        </FullScreenModal>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    detailsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    portionContainer: {
        justifyContent: "center",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    portionControlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    portionButton: {
        marginHorizontal: 0,
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    portionInput: {
        width: 50,
        textAlign: 'center',
    },
    descriptionContainer: {
        flexDirection: 'column',
    },
    detailImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        flex: 1,
        marginRight: 8,
    },
    addToCartButton: {
        marginTop: 16
    },
    infoContainer: {
        flexDirection: 'column',
        gap: 8,
        marginBottom: 12
    },
});
