import { RecipeDifficulty } from "@/types/RecipeTypes";
import { difficultyToColor } from "@/utils/DifficultyUtils";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";


type DifficultyPickerProps = {
    value?: RecipeDifficulty,
    onValueChange?: (difficulty?: RecipeDifficulty) => void
}

export default function DifficultyPicker(props: DifficultyPickerProps) {
    return (
        <View style={styles.view}>
            {
                Object.values(RecipeDifficulty)
                    .filter(item => typeof item !== 'string')
                    .map(
                        (difficulty, index) => (
                            <TouchableOpacity key={index} style={styles.touchableOpacity} onPress={() => props.onValueChange?.(difficulty == props.value ? undefined : difficulty)}>
                    
                                <Ionicons name={props.value == difficulty ? "ellipse" : "ellipse-outline"} size={27}  color={difficultyToColor(difficulty)}/>

                            </TouchableOpacity>
                        )
                    )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row"
    },
    touchableOpacity: {
        padding: 1
    }
});
