import { StyleSheet, View } from "react-native";
import TextField from "../TextField";
import { ThemedText } from "../themed/ThemedText";
import { useEffect, useState } from "react";
import { isBlank, isNumeric } from "../../utils/StringUtils";
import { unitToString } from "@/utils/UnitUtils";
import { CalorificValue, Unit } from "@/types/IngredientTypes";

type CalorificValueInputProps = {
    initialValue?: CalorificValue,
    onValueChanged?: (calorificValue: CalorificValue | undefined) => void,
    unit: Unit
}

export default function CalorificValueInput(props: CalorificValueInputProps) {
    const [kcalText, setKcalText] = useState(props.initialValue?.kcal?.toString() ?? "");
    const [nUnitsText, setNUnitsText] = useState(props.initialValue?.nUnits?.toString() ?? "");

    useEffect(() => {
        if (props.onValueChanged) {
            props.onValueChanged(parseTextsToCalorificValue());
        }
    }, [kcalText, nUnitsText]);

    function parseKcalText(): number | undefined {
        if (isBlank(kcalText) || !isNumeric(kcalText)) {
            return undefined;
        }

        const kcal = +kcalText;

        return kcal >= 0
            ? kcal
            : undefined;
    }

    function parseNUnitsText(): number | undefined {
        if (isBlank(nUnitsText) || !isNumeric(nUnitsText)) {
            return undefined;
        }

        const kcal = +nUnitsText;

        return kcal > 0
            ? kcal
            : undefined;
    }

    function parseTextsToCalorificValue(): CalorificValue | undefined {
        const kcal = parseKcalText();
        const nUnits = parseNUnitsText();

        return kcal == undefined || nUnits == undefined
            ? undefined
            : { kcal, nUnits };
    }

    return (
        <View style={styles.calorieInput}>
            <TextField
                placeholder='kcal'
                onChangeText={setKcalText}
                style={[
                    styles.smallTextField
                ]}
                isErroneous={!(parseKcalText() != undefined || isBlank(kcalText))}
            >
                {props.initialValue?.kcal}
            </TextField>
            <ThemedText>kcal pro</ThemedText>
            <TextField
                placeholder={unitToString(props.unit)}
                onChangeText={setNUnitsText}
                style={styles.smallTextField}
                isErroneous={!(parseNUnitsText() != undefined || isBlank(nUnitsText))}
            >
                {props.initialValue?.nUnits}
            </TextField>
            <ThemedText>{unitToString(props.unit)}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    calorieInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        flexWrap: "wrap"
    },
    smallTextField: {
        minWidth: 80,
        textAlign: "center"
    }
});