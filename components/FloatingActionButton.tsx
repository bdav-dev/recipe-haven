import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from "react-native";

type FloatingActionButtonProps = {
    children?: React.ReactNode,
    onPress?: () => void,
    position: 'left' | 'right',
    color?: string,
    style?: ViewStyle,
    round?: boolean
}

export default function FloatingActionButton(props: FloatingActionButtonProps) {
    const theme = useAppTheme();

    const round = props.round == undefined ? true : props.round;

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={
                [
                    styles.fab,
                    { left: props.position == 'left' ? GAP : undefined, right: props.position == "right" ? GAP : undefined },
                    { backgroundColor: props.color ?? theme.accent },
                    round ? { width: 55, height: 55} : undefined,
                    props.style
                ]
            }
        >
            {props.children}
        </TouchableOpacity>
    );
}

const GAP = 25;
const styles = StyleSheet.create({
    fab: { 
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: GAP,
        zIndex: 1,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 5,
    }
});
