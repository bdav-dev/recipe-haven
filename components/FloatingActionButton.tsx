import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import { StyleSheet, TouchableOpacity } from "react-native";

type FloatingActionButtonProps = {
    children?: React.ReactNode,
    onPress?: () => void
}

export default function FloatingActionButton(props: FloatingActionButtonProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={styles.fab}
        >
            {props.children}
        </TouchableOpacity>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    fab: {
        width: 60,
        height: 60,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.accent,
        position: "absolute",
        bottom: 25,
        right: 25,
        zIndex: 1,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 5,
    }
});
