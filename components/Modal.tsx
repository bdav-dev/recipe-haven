import { KeyboardAvoidingView, Platform, Modal as ReactNativeModal, StyleSheet, View } from "react-native";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import Button from "./Button";
import { ThemedText } from "./themed/ThemedText";

type ModalProps = {
    children?: React.ReactNode,
    isVisible: boolean,
    title?: string | React.ReactNode
    primaryActionButton?: {
        title: string
        onPress: () => void,
        disabled?: boolean
    }
    onRequestClose?: () => void
}

export default function Modal(props: ModalProps) {
    const styles = useThemedStyleSheet(theme => styleSheet(theme));

    return (
        <ReactNativeModal
            animationType='slide'
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.onRequestClose}
        >
            <View style={styles.centered}>
                <KeyboardAvoidingView
                    style={styles.modal}
                    keyboardVerticalOffset={Platform.select({ ios: 30, android: 40 })}
                    behavior="padding"
                >

                    <View style={styles.header}>
                        <Button title="Schließen" onPress={props.onRequestClose} style={styles.headerButton} />

                        {
                            typeof props.title === 'string'
                                ? <View style={styles.headerTitleContainer}>
                                    <ThemedText type="subtitle" style={styles.headerTitle}>{props.title}</ThemedText>
                                </View>
                                : props.title
                        }

                        {
                            props.primaryActionButton &&
                            <Button
                                style={styles.headerButton}
                                title={props.primaryActionButton.title}
                                onPress={props.primaryActionButton.onPress}
                                disabled={props.primaryActionButton.disabled}
                            />
                        }
                    </View>

                    <View style={styles.contentView}>
                        {props.children}
                    </View>
                </KeyboardAvoidingView>

            </View>
        </ReactNativeModal >
    );
}


const styleSheet = (theme: AppTheme) => StyleSheet.create({
    headerTitleContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        flex: 1,
        marginHorizontal: 90,
    },
    headerTitle: {
        alignSelf: "center"
    },
    headerButton: {
        zIndex: 2
    },
    expandingFlexContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
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
    modal: {
        borderWidth: theme.modal.borderWidth,
        borderRadius: 20,
        shadowRadius: 20,
        shadowColor: "black",
        shadowOpacity: theme.modal.shadowOpacity,
        shadowOffset: { height: 0, width: 0 },
        borderColor: theme.border,
        backgroundColor: theme.background,
        width: "90%"
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
