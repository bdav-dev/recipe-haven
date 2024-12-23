import { StyleSheet, View } from "react-native";
import TextField from "../TextField";
import { ThemedText } from "../themed/ThemedText";
import { Image } from "react-native";
import Button from "../Button";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import { getQuantizedIngredientFrontendText, unitToConvertedStringAsObject, unitToString } from "@/utils/UnitUtils";
import { quantizedIngredientNameToString } from "@/utils/IngredientUtils";
import { isBlank } from "@/utils/StringUtils";


type RecipeIngredientListItemProps = {
    recipeIngredient: QuantizedIngredient
    control?: {
        onDelete?: (qIng: QuantizedIngredient) => void,
        onMoveUp?: (qIng: QuantizedIngredient) => void,
        onMoveDown?: (qIng: QuantizedIngredient) => void
    }
}

export default function RecipeIngredientListItem(props: RecipeIngredientListItemProps) {

    const text = getQuantizedIngredientFrontendText(props.recipeIngredient);

    return (
        <View style={styles.recipeIngredientListItem}>
            <TextField
                style={styles.amountTextField}
                keyboardType="numeric"
                readOnly
                value={text.amount}
            />
            {
                <ThemedText style={styles.unitText}>{text.unit}</ThemedText>
            }
            {
                props.recipeIngredient.ingredient.imageSrc &&
                <Image source={{ uri: props.recipeIngredient.ingredient.imageSrc }} style={styles.image} />
            }
            <ThemedText style={{ flex: 1 }} numberOfLines={1}>{text.displayName}</ThemedText>

            {
                (props.control?.onMoveDown || props.control?.onMoveUp) &&
                <View style={{ flexDirection: "column" }}>
                    {
                        props.control &&
                        <Button
                            style={styles.moveButton}
                            disabled={!props.control.onMoveUp}
                            onPress={() => props.control!.onMoveUp!(props.recipeIngredient)}
                            ionicon="chevron-up-outline"
                        />
                    }
                    {
                        props.control &&
                        <Button
                            onPress={() => props.control!.onMoveDown!(props.recipeIngredient)}
                            disabled={!props.control.onMoveDown}
                            style={styles.moveButton}
                            ionicon="chevron-down-outline"
                        />
                    }
                </View>
            }
            {
                props.control?.onDelete &&
                <Button
                    onPress={() => props.control!.onDelete!(props.recipeIngredient)}
                    ionicon="trash-outline"
                    type="destructive"
                />
            }
        </View>
    );
}

const IMAGE_SIZE = 35;

const styles = StyleSheet.create({
    recipeIngredientListItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginVertical: 3
    },
    amountTextField: {
        minWidth: 55,
        textAlign: "center"
    },
    unitText: {
        marginRight: 3,
        minWidth: 15
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 999
    },
    imagePlaceholder: {
        width: IMAGE_SIZE
    },
    spacer: {
        flex: 1
    },
    moveButton: {
        marginHorizontal: 0,
        paddingHorizontal: 0,
        paddingVertical: 0
    }
});