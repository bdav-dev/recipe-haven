import { AppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";



export default function TextField({
    style,
    placeholder,
    onChangeText,
    ...rest
}: TextInputProps) {
    const styles = useThemedStyleSheet(theme => createStylesheet(theme));

    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            style={[styles.textInput, style]}
            {...rest}
        />
    );
}

const createStylesheet = (theme: AppTheme) => StyleSheet.create({
    textInput: {
        backgroundColor: theme.border,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        color: theme.text,
        fontSize: 18
    }
});