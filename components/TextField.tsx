import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import { StyleSheet, TextInput, TextInputProps } from "react-native";


type TextFieldProps = TextInputProps & {
    isErroneous?: boolean
}

export default function TextField({
    children,
    isErroneous,
    style,
    placeholder,
    onChangeText,
    ...rest
}: TextFieldProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            style={[
                { borderWidth: isErroneous ? 1.5 : 0 },
                styles.textInput,
                style
            ]}
            {...rest}
        >
            {children}
        </TextInput>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    textInput: {
        borderColor: theme.erroneousTextFieldBorder,
        backgroundColor: theme.border,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        color: theme.text,
        fontSize: 18
    }
});