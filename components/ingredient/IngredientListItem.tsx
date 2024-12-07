import { Ingredient } from "@/types/IngredientTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { unitToConvertedString, unitToString } from "@/utils/UnitUtils";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import ThemedBadge from "../themed/ThemedBadge";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type IngredientListItemProps = {
    ingredient: Ingredient,
    editButton?: { onPress: () => void }
    selectable?: { onPress?: () => void }
}

export default function IngredientListItem(props: IngredientListItemProps) {
    const ingredient = props.ingredient;
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    return (
        <CardView style={styles.card} noPadding>

            <View style={styles.mainInfoView}>
                {
                    ingredient.imageSrc
                        ? <Image source={{ uri: ingredient.imageSrc }} style={styles.image} />
                        : <View style={{ width: 7 }} />
                }

                <View style={styles.nameView}>
                    <ThemedText type="largeSemiBold" numberOfLines={1}>{ingredient.name}</ThemedText>
                    {
                        ingredient.pluralName &&
                        <ThemedText numberOfLines={1}>{props.ingredient.pluralName}</ThemedText>
                    }
                </View>

                {
                    props.editButton &&
                    <TouchableOpacity style={styles.editButton} onPress={props.editButton.onPress}>
                        <Ionicons name="pencil-outline" size={28} color={theme.button.default} />
                    </TouchableOpacity>
                }
            </View>

            <View style={styles.badgeView}>
                <ThemedBadge>
                    <ThemedText>in </ThemedText>
                    <ThemedText type="defaultSemiBold">{unitToString(ingredient.unit)}</ThemedText>
                </ThemedBadge>

                {
                    ingredient.calorificValue &&
                    <ThemedBadge>
                        <ThemedText type="defaultSemiBold">{ingredient.calorificValue.kcal} kcal </ThemedText>
                        <ThemedText>pro </ThemedText>
                        <ThemedText type="defaultSemiBold">{unitToConvertedString(ingredient.calorificValue.nUnits, ingredient.unit)}</ThemedText>
                    </ThemedBadge>
                }
            </View>

        </CardView>
    );
}

const IMAGE_SIZE = 85;

const createStyles = (theme: AppTheme) => StyleSheet.create({
    card: {
        display: "flex",
        flexDirection: "column",
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        borderWidth: theme.ingredientListItem.borderWidth,
        borderColor: theme.border
    },
    mainInfoView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7
    },
    nameView: {
        flex: 1,
        marginVertical: 10
    },
    image: {
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
        borderRadius: 9,
        margin: 6
    },
    badgeView: {
        display: "flex",
        flexDirection: "row",
        gap: 6,
        padding: 7,
        backgroundColor: theme.background,
        borderBottomLeftRadius: 11,
        borderBottomRightRadius: 11,
        justifyContent: "space-evenly",
        overflow: "hidden"
    },
    editButton: {
        marginLeft: "auto",
        marginRight: 16
    }
});
