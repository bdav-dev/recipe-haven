import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FloatingActionButtonProps = {
    onPress?: () => void
}

export default function FloatingActionButton(props: FloatingActionButtonProps) {

    return (
        <View style={styles.container}>
            <Pressable
                onPress={props.onPress}
                style={({ pressed }) => [
                    styles.fab,
                    { backgroundColor: pressed ? '#444444' : "#FFFFFF" }
                ]}
            >
                <Ionicons name="add-outline"/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        width: 55,
        height: 55,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 1
    }
});