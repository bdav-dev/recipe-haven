import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import ModalHeader from "./ModalHeader";
import { ModalProps } from "./Modal";

export default function FullScreenModal({
    children,
    isVisible,
    ...header
}: ModalProps) {
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
                    keyboardVerticalOffset={Platform.select({ ios: 30, android: 40 })}
                    behavior="padding"
                >
                    <ModalHeader {...header} />
                    <ScrollView style={styles.scrollView}>
                        {children}
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
        height: "100%",
        marginTop: 75,
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
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        display: "flex",
        width: "100%"
    }
});
