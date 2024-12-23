import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

type StarProps = {
    filled?: boolean,
    onPress?: () => void,
    disabled?: boolean
}

export default function Star(props: StarProps) {
    const iconName = props.filled ? "star" : "star-outline";

    return (
        <TouchableWithoutFeedback onPress={props.onPress} disabled={props.disabled}>
            <View>
                <Ionicons name={iconName} style={styles.star} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    star: {
        color: "#ca8a04",
        fontSize: 25,
    }
});
