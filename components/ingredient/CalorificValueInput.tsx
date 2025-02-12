import { StyleSheet, View, ViewStyle } from "react-native";
import TextField from "../TextField";
import { ThemedText } from "../themed/ThemedText";
import { useEffect, useState } from "react";
import { isBlank, isNumeric } from "../../utils/StringUtils";
import { unitToString } from "@/utils/UnitUtils";
import { CalorificValue, Unit } from "@/types/IngredientTypes";

type CalorificValueInputProps = {
    initialValue?: CalorificValue,
    onValueChanged?: (calorificValue: CalorificValue | undefined) => void,
    unit: Unit,
    style?: ViewStyle
}

export default function CalorificValueInput(props: CalorificValueInputProps) {
    const [kcalText, setKcalText] = useState(props.initialValue?.kcal?.toString() ?? "");
    const [nUnitsText, setNUnitsText] = useState(props.initialValue?.nUnits?.toString() ?? "");

    useEffect(() => {
        setKcalText(props.initialValue?.kcal?.toString() ?? "");
        setNUnitsText(props.initialValue?.nUnits?.toString() ?? "");
    }, [props.initialValue]);
    
    useEffect(() => {
        props.onValueChanged?.(parseTextsToCalorificValue());
    }, [kcalText, nUnitsText]);

    function parseKcalText(): number | undefined {
        const formattedKcalText = kcalText.replace(',', '.');

        if (isBlank(formattedKcalText) || !isNumeric(formattedKcalText)) {
            return undefined;
        }

        const kcal = +(formattedKcalText);

        return kcal >= 0
            ? kcal
            : undefined;
    }

    function parseNUnitsText(): number | undefined {
        const formattedNUnitsText = nUnitsText.replace(',', '.');
        
        if (isBlank(formattedNUnitsText) || !isNumeric(formattedNUnitsText)) {
            return undefined;
        }

        const kcal = +formattedNUnitsText;

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
        <View style={[styles.calorieInput, props.style]}>
            <TextField
                keyboardType="numeric"
                placeholder='kcal'
                style={styles.smallTextField}
                isErroneous={!(parseKcalText() != null || isBlank(kcalText))}
                onChangeText={setKcalText}
                defaultValue={props.initialValue?.kcal.toString()}
            />
            <ThemedText>kcal pro</ThemedText>
            <TextField
                keyboardType="numeric"
                placeholder={"Menge"}
                style={styles.smallTextField}
                isErroneous={!(parseNUnitsText() != null || isBlank(nUnitsText))}
                onChangeText={setNUnitsText}
                defaultValue={props.initialValue?.nUnits.toString()}
            />
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
        minWidth: 78,
        textAlign: "center"
    }
});