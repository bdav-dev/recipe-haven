import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import ModalHeader from "./ModalHeader";
import { ModalProps } from "./Modal";


type FullScreenModalProps = ModalProps & {
    preScrollViewChildren?: React.ReactNode,
    customLeftButton?: {
        title: string,
        onPress: () => void
    }
};

export default function FullScreenModal({
    children,
    isVisible,
    onContentViewLayout,
    preScrollViewChildren,
    customLeftButton,
    ...header
}: FullScreenModalProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isVisible}
            onRequestClose={header.onRequestClose}
        >
            <View style={styles.centered}>
                <KeyboardAvoidingView
                    style={styles.modal}
                    keyboardVerticalOffset={Platform.select({ ios: 11, android: 11 })}
                    behavior="height"
                >
                    <ModalHeader customLeftButton={customLeftButton} {...header} />
                    {preScrollViewChildren}
                    <ScrollView style={styles.scrollView} onLayout={onContentViewLayout} keyboardShouldPersistTaps="handled">
                        {children}
                        <View style={{ height: 55 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
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
        width: "96%",
        flex: 1,
        marginTop: 55,
        borderRadius: 20,
        alignItems: "center",
        shadowRadius: 20,
        shadowColor: "black",
        shadowOpacity: theme.modal.shadowOpacity,
        shadowOffset: { height: 0, width: 0 },
        backgroundColor: theme.background,
        borderColor: theme.border
    },
    centered: {
        flex: 1,
        alignItems: "center"
    },
    scrollView: {
        display: "flex",
        width: "100%"
    }
});
