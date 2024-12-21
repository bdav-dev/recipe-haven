import { Recipe } from "@/types/RecipeTypes";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import CardView from "../themed/CardView";
import Star from "./Star";
import DurationLabel from "./DurationLabel";
import DifficultyLabel from "./DifficultyLabel";
import CalorieLabel from "./CalorieLabel";
import AutoColorBadge from "../AutoColorBadge";
import { useAppTheme } from "@/hooks/useAppTheme";
import IngredientsPreview from "./IngredientsPreview";
import { getTotalKcalPerPortion } from "@/utils/RecipeUtils";

type RecipeListItemProps = {
    recipe: Recipe,
    onPress?: (recipe: Recipe) => void
}

const TAG_LIMIT = 3;
const INGREDIENT_PREVIEW_LIMIT = 3;

export default function RecipeListItem(props: RecipeListItemProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);
    const recipe = props.recipe;
    const kcalPerPortion = getTotalKcalPerPortion(recipe);

    const doesRecipeHaveTags = recipe.tags.length != 0;
    const doesRecipeHaveIngredientsWithImage = recipe.ingredientsForOnePortion.filter(item => item.ingredient.imageSrc).length != 0;
    const amountOfRecipeInfo = (
        (recipe.preparationTime ? 1 : 0)
        + (recipe.difficulty != undefined ? 1 : 0)
        + (kcalPerPortion != undefined ? 1 : 0)
    );

    return (
        <View style={styles.container}>
            {
                recipe.imageSrc &&
                <Image source={{ uri: recipe.imageSrc }} style={styles.image} />
            }

            <CardView style={styles.card}>

                <View style={styles.header}>
                    <ThemedText style={styles.recipeTitle} type="midtitle">{recipe.title}</ThemedText>
                    <Star filled={recipe.isFavorite} />
                </View>

                {
                    amountOfRecipeInfo != 0 &&
                    <View style={[styles.infoView, { justifyContent: amountOfRecipeInfo == 3 ? 'space-between' : 'flex-start' }]}>
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
                }

                {
                    (doesRecipeHaveTags || doesRecipeHaveIngredientsWithImage) &&
                    <View style={styles.tagAndIngredientPreviewView}>
                        {
                            doesRecipeHaveTags &&
                            <View style={styles.tagView}>
                                {
                                    recipe.tags
                                        .slice(0, TAG_LIMIT)
                                        .map(
                                            (tag, index) => <AutoColorBadge key={index} text={tag} />
                                        )
                                }
                                {
                                    recipe.tags.length > TAG_LIMIT &&
                                    <AutoColorBadge text="..." saturationMultiplier={0} valueMultiplier={0.97} />
                                }
                            </View>
                        }
                        {
                            doesRecipeHaveIngredientsWithImage &&
                            <View style={styles.ingredientsView}>
                                <IngredientsPreview limit={INGREDIENT_PREVIEW_LIMIT} ingredients={recipe.ingredientsForOnePortion.map(qIng => qIng.ingredient)} borderColor={theme.card} />
                            </View>
                        }
                    </View>
                }
            </CardView>
        </View>
    );

}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    recipeTitle: {
        flex: 1
    },
    container: {
        width: "100%",
        gap: 4
    },
    header: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    infoView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8
    },
    tagView: {
        flexDirection: "row",
        gap: 5,
        flexWrap: "wrap",
        flex: 1
    },
    tagAndIngredientPreviewView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 5
    },
    ingredientsView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        overflow: "hidden",
        marginLeft: "auto"
    },
    card: {
        borderWidth: theme.ingredientListItem.borderWidth,
        borderColor: theme.border,
        gap: 6,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.1
    },
    image: {
        width: "100%",
        height: 175,
        borderRadius: 13,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.1
    }
});
