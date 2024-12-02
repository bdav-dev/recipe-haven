import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { RecipeDifficulty } from "@/types/RecipeTypes";
import { difficultyToColor, difficultyToString } from "@/utils/DifficultyUtils";


type DifficultyLabelProps = {
    difficulty: RecipeDifficulty
}

export default function DifficultyLabel(props: DifficultyLabelProps) {

    const color = difficultyToColor(props.difficulty);

    return (
        <View style={styles.toname1}>
            <Ionicons name="ellipse" style={[styles.icon, { color }]} />
            <ThemedText>{difficultyToString(props.difficulty)}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    toname1: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 3
    },
    icon: {
        fontSize: 17
    }
});