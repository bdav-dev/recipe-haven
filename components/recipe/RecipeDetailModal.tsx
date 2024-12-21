import { Recipe } from "@/types/RecipeTypes";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import FullScreenModal from "../modals/FullScreenModal";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { useState } from "react";
import DifficultyLabel from "./DifficultyLabel";
import DurationLabel from "./DurationLabel";
import AutoColorBadge from "../AutoColorBadge";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import RecipeIngredientListItem from "./RecipeIngredientListItem";
import TextField from "../TextField";
import { isPositiveInteger } from "@/utils/MathUtils";

type RecipeDetailModalProps = {
    recipe: Recipe | null;
    isVisible: boolean;
    onRequestClose: () => void;
}

export default function RecipeDetailModal({ recipe, isVisible, onRequestClose }: RecipeDetailModalProps) {
    const styles = useThemedStyleSheet(createStyles);
    const [portionMultiplier, setPortionMultiplier] = useState("1");
    
    if (!recipe) return null;

    const multiplier = isPositiveInteger(+portionMultiplier) ? +portionMultiplier : 1;
    const scaledIngredients: QuantizedIngredient[] = recipe.ingredientsForOnePortion.map(ing => ({
        ...ing,
        amount: ing.amount * multiplier
    }));

    return (
        <FullScreenModal
            isVisible={isVisible}
            onRequestClose={onRequestClose}
            title={recipe.title}
        >
            <ScrollView style={styles.scrollView}>
                {recipe.imageSrc && (
                    <Image source={{ uri: recipe.imageSrc }} style={styles.image} />
                )}

                <View style={styles.content}>
                    <CardView title="Details">
                        <View style={styles.detailsContainer}>
                            {recipe.difficulty && <DifficultyLabel difficulty={recipe.difficulty} />}
                            {recipe.preparationTime && <DurationLabel duration={recipe.preparationTime} />}
                        </View>

                        {recipe.tags.length > 0 && (
                            <View style={styles.tagsContainer}>
                                {recipe.tags.map((tag, index) => (
                                    <AutoColorBadge key={index} text={tag} />
                                ))}
                            </View>
                        )}
                    </CardView>

                    {recipe.description && (
                        <CardView title="Beschreibung">
                            <View style={styles.descriptionContainer}>
                                <ThemedText>{recipe.description}</ThemedText>
                            </View>
                        </CardView>
                    )}

                    <CardView title="Zutaten">
                        <View style={styles.portionContainer}>
                            <ThemedText>Zutaten für </ThemedText>
                            <TextField
                                style={styles.portionInput}
                                keyboardType="numeric"
                                value={portionMultiplier}
                                onChangeText={setPortionMultiplier}
                                isErroneous={!isPositiveInteger(+portionMultiplier)}
                            />
                            <ThemedText> Portion(en)</ThemedText>
                        </View>

                        {scaledIngredients.map((ingredient, index) => (
                            <RecipeIngredientListItem
                                key={index}
                                recipeIngredient={ingredient}
                            />
                        ))}
                    </CardView>
                </View>
            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    portionInput: {
        width: 50,
        textAlign: 'center',
    },
    descriptionContainer: {
        flexDirection: 'column',
    },
});
