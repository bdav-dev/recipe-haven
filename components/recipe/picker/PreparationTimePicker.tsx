import TextField from "@/components/TextField";
import { ThemedText } from "@/components/themed/ThemedText";
import { StyleSheet, View } from "react-native";

type PreparationTimePickerProps = {
    hours: {
        value: string,
        onChangeText: (value: string) => void,
        isErroneous?: boolean
    },
    minutes: {
        value: string,
        onChangeText: (value: string) => void,
        isErroneous?: boolean
    }
}

export default function PreparationTimePicker(props: PreparationTimePickerProps) {
    return (
        <View style={styles.view}>
            <TextField
                keyboardType="numeric"
                style={styles.textField}
                {...props.hours}
            />
            <ThemedText style={styles.label}>h </ThemedText>
            <TextField
                keyboardType="numeric"
                style={styles.textField}
                {...props.minutes}
            />
            <ThemedText style={styles.label}>min</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        justifyContent: "center"
    },
    textField: {
        flex: 1,
        maxWidth: 80,
        textAlign: "center"
    },
    label: {
        fontSize: 19
    }
});