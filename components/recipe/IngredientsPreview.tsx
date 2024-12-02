import { Ingredient } from "@/types/IngredientTypes";
import { Image, StyleSheet, Text, View } from "react-native";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type IngredientsPreviewProps = {
    ingredients: Ingredient[],
    borderColor: string,
    limit?: number
}

const OVERLAP_AMOUNT = 10;
const IMAGE_SIZE = 28;

export default function IngredientsPreview(props: IngredientsPreviewProps) {
    const styles = useThemedStyleSheet(createStyles);

    const ingredientsWithImage = props.ingredients.filter(ingredient => ingredient.imageSrc != undefined);
    const items = ingredientsWithImage.slice(0, props.limit);

    const wasTruncated = props.limit ? ingredientsWithImage.length > props.limit : false;
    const maxItemIndex = items.length + (wasTruncated ? 1 : 0) - 1;

    const createTransformStyle = (index: number) => ({ transform: [{ translateX: -OVERLAP_AMOUNT * index }] });
    const borderColorStyle = { borderColor: props.borderColor };

    const width = IMAGE_SIZE + (maxItemIndex * (IMAGE_SIZE - OVERLAP_AMOUNT));

    return (
        <View style={[styles.view, { width }]}>
            {
                items.map(
                    (item, index) =>
                        <Image
                            key={index}
                            source={{ uri: item.imageSrc }}
                            style={[styles.item, borderColorStyle, createTransformStyle(index)]}
                        />
                )
            }
            {
                wasTruncated &&
                <View
                    style={[styles.item, styles.ellipsisTextContainer, borderColorStyle, createTransformStyle(maxItemIndex)]}
                >
                    <Text style={styles.ellipsisText}>...</Text>
                </View>
            }
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    view: {
        display: "flex",
        flexDirection: "row"
    },
    item: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 999,
        borderWidth: 1.5,
        alignItems: "center"
    },
    ellipsisText: {
        color: theme.text
    },
    ellipsisTextContainer: {
        backgroundColor: theme.ingredientsPreview.moreBadge.backgroundColor
    }
});
