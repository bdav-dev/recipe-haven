import { StyleSheet, View } from "react-native";
import Button from "../Button";
import { ThemedText } from "../themed/ThemedText";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";


type ModalHeaderProps = {
    title?: string,
    customLeftButton?: {
        title: string
        onPress: () => void,
    },
    rightButton?: {
        title: string
        onPress: () => void,
        disabled?: boolean
    },
    onRequestClose?: () => void
}

export default function ModalHeader(props: ModalHeaderProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <View style={styles.header}>
            {
                props.customLeftButton
                    ? <Button title={props.customLeftButton.title} onPress={props.customLeftButton.onPress} style={styles.button} />
                    : <Button title="Schließen" onPress={props.onRequestClose} style={styles.button} />
            }

            {
                props.title &&
                <ThemedText type="subtitle" numberOfLines={1} style={styles.title}>{props.title}</ThemedText>
            }
            {
                props.rightButton
                    ? <Button
                        textStyle={{ fontWeight: "600" }}
                        style={styles.button}
                        title={props.rightButton.title}
                        onPress={props.rightButton.onPress}
                        disabled={props.rightButton.disabled}
                    />
                    : <View style={styles.placeholder} />
            }
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    header: {
        position: "relative",
        height: 50,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        paddingHorizontal: 3,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 0.5,
        backgroundColor: theme.card,
        borderColor: theme.border
    },
    title: {
        textAlign: "center",
        flex: 1
    },
    button: {
        zIndex: 2,
    },
    placeholder: {
        minWidth: 100
    }
});
