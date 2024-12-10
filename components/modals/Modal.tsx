import { KeyboardAvoidingView, LayoutChangeEvent, Platform, Modal as ReactNativeModal, StyleSheet, View } from "react-native";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import ModalHeader from "./ModalHeader";

export type ModalProps = {
    children?: React.ReactNode,
    isVisible: boolean,
    title?: string,
    onContentViewLayout?: (event: LayoutChangeEvent) => void,
    primaryActionButton?: {
        title: string
        onPress: () => void,
        disabled?: boolean
    }
    onRequestClose?: () => void
}

export default function Modal({
    children,
    isVisible,
    onContentViewLayout,
    ...header
}: ModalProps) {
    const styles = useThemedStyleSheet(theme => createStyles(theme));

    return (
        <ReactNativeModal
            animationType='slide'
            transparent={true}
            visible={isVisible}
            onRequestClose={header.onRequestClose}
        >
            <View style={styles.centered}>
                <KeyboardAvoidingView
                    style={styles.modal}
                    keyboardVerticalOffset={Platform.select({ ios: 30, android: 40 })}
                    behavior="padding"
                >
                    <ModalHeader {...header} />
                    <View style={styles.contentView} onLayout={onContentViewLayout}>
                        {children}
                    </View>
                </KeyboardAvoidingView>

            </View>
        </ReactNativeModal>
    );
}


const createStyles = (theme: AppTheme) => StyleSheet.create({
    expandingFlexContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
    modal: {
        borderWidth: theme.modal.borderWidth,
        borderRadius: 20,
        shadowRadius: 20,
        shadowColor: "black",
        shadowOpacity: theme.modal.shadowOpacity,
        shadowOffset: { height: 0, width: 0 },
        borderColor: theme.border,
        backgroundColor: theme.background,
        width: "97%"
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contentView: {
        display: "flex",
        width: "100%",
        padding: 10
    }
});
