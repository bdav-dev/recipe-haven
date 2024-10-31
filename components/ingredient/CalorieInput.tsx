import { StyleSheet, View } from "react-native";
import TextField from "../TextField";
import { ThemedText } from "../themed/ThemedText";
import { Unit, unitToString } from "@/types/MainAppTypes";
import { useEffect, useMemo, useState } from "react";

type CalorieInputProps = {
    unit: Unit,
    onKcalValueChanged?: (kcal: number | null) => void
    onNUnitsValueChanged?: (nUnits: number | null) => void
}

export default function CalorieInput(props: CalorieInputProps) {
    const [kcalText, setKcalText] = useState("");
    const [nUnitsText, setNUnitsText] = useState("");

    const kcal = useMemo(() => parseStringToNumber(kcalText), [kcalText]);
    const nUnits = useMemo(() => parseStringToNumber(nUnitsText), [nUnitsText]);

    useEffect(() => {
        if (props.onKcalValueChanged) {
            props.onKcalValueChanged(kcal);
        }
    }, [kcal]);

    useEffect(() => {
        if (props.onNUnitsValueChanged) {
            props.onNUnitsValueChanged(nUnits);
        }
    }, [nUnits]);

    return (
        <View style={styles.calorieInput}>
            <TextField
                placeholder='kcal'
                onChangeText={setKcalText}
                style={[
                    styles.smallTextField
                ]}
                isErroneous={kcalText !== "" && kcal == null}
            />
            <ThemedText>kcal pro</ThemedText>
            <TextField
                placeholder={unitToString(props.unit)}
                onChangeText={setNUnitsText}
                style={styles.smallTextField}
                isErroneous={nUnitsText !== "" && nUnits == null}
            />
            <ThemedText>{unitToString(props.unit)}</ThemedText>
        </View>
    );
}

function parseStringToNumber(kcalText: string): number | null {
    if (kcalText === "") {
        return null;
    }

    const kcal = +kcalText;
    return isNaN(kcal) ? null : kcal;
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