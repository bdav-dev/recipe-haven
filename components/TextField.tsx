import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import { StyleSheet, TextInput, TextInputProps } from "react-native";


type TextFieldProps = TextInputProps & {
    isErroneous?: boolean
}

export default function TextField({
    isErroneous,
    style,
    placeholder,
    onChangeText,
    ...rest
}: TextFieldProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.textField.placeholder}
            onChangeText={onChangeText}
            style={[
                { borderColor: isErroneous ? theme.textField.borderErroneous : theme.border },
                styles.textInput,
                style
            ]}
            {...rest}
        />
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    textInput: {
        borderWidth: 1,
        backgroundColor: theme.textField.background,
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 10,
        color: theme.text,
        fontSize: 16
    }
});