import { Recipe } from "@/types/RecipeTypes";
import { Image, ScrollView, StyleSheet, View } from "react-native";
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
import { setRecipeFavorite } from "@/data/dao/RecipeDao";
import CalorieLabel from "./CalorieLabel";
import { getTotalKcalPerPortion } from "@/utils/RecipeUtils";
import Button from "../Button";

type RecipeDetailModalProps = {
    recipe: Recipe | null;
    isVisible: boolean;
    onRequestClose: () => void;
}

export default function RecipeDetailModal({ recipe, isVisible, onRequestClose }: RecipeDetailModalProps) {
    const { setRecipes } = useContext(RecipeContext);

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
                <View style={styles.content}>
                    <CardView>
                        {
                            recipe.imageSrc && (
                                <Image source={{ uri: recipe.imageSrc }} style={styles.detailImage} />
                            )
                        }

                        <View style={styles.titleContainer}>
                            <ThemedText type="midtitle" style={styles.title}>
                                {recipe.title}
                            </ThemedText>
                            <Star filled={recipe.isFavorite} onPress={handleFavoriteToggle} />
                        </View>

                        <View style={styles.detailsContainer}>
                            {
                                recipe.preparationTime &&
                                <DurationLabel duration={recipe.preparationTime} />
                            }
                            {
                                kcalPerPortion != undefined &&
                                <CalorieLabel kiloCalories={kcalPerPortion} />
                            }
                            {
                                recipe.difficulty != undefined &&
                                <DifficultyLabel difficulty={recipe.difficulty} />
                            }
                        </View>

                        {
                            recipe.tags.length > 0 && (
                                <View style={styles.tagsContainer}>
                                    {
                                        recipe.tags.map((tag, index) => (
                                            <AutoColorBadge key={index} text={tag} />
                                        ))
                                    }
                                </View>
                            )
                        }
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
    }
});
