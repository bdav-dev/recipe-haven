import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed/ThemedText";


type CalorieLabelProps = {
    kiloCalories: number
}

export default function CalorieLabel(props: CalorieLabelProps) {
    return (
        <View style={styles.view}>
            <Ionicons name="flame-outline" style={styles.icon} />
            <ThemedText>{Number.isInteger(props.kiloCalories) ? props.kiloCalories.toString() : props.kiloCalories.toFixed(1).toString()} kcal</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2
    },
    icon: {
        color: "#ef4444",
        fontSize: 22
    }
});
