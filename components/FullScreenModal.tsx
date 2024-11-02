import { Button, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { AppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type FullScreenModalProps = {
    children?: React.ReactNode,
    isVisible: boolean,
    title: string | React.ReactNode,
    primaryActionButton?: {
        title: string
        onPress: () => void,
        disabled?: boolean
    }
    onRequestClose?: () => void
}

export default function FullScreenModal(props: FullScreenModalProps) {
    const styles = useThemedStyleSheet(theme => styleSheet(theme));

    return (
        <Modal
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

                        <View style={[styles.expandingFlexContainer, { justifyContent: "flex-start" }]}>
                            <Button title="Schließen" onPress={props.onRequestClose} />
                        </View>

                        <View style={[styles.expandingFlexContainer, { justifyContent: "center" }]}>
                            {
                                typeof props.title === 'string'
                                    ? <ThemedText type="subtitle">{props.title}</ThemedText>
                                    : props.title
                            }
                        </View>

                        <View style={[styles.expandingFlexContainer, { justifyContent: "flex-end" }]}>
                            {
                                props.primaryActionButton
                                    ? <Button
                                        title={props.primaryActionButton.title}
                                        onPress={props.primaryActionButton.onPress}
                                        disabled={props.primaryActionButton.disabled}
                                    />
                                    : <></>
                            }
                        </View>
                    </View>

                    <ScrollView style={{ display: "flex", width: "100%" }}>
                        {props.children}
                    </ScrollView>

                </KeyboardAvoidingView>

            </View>

        </Modal>
    );
}


const styleSheet = (theme: AppTheme) => StyleSheet.create({
    expandingFlexContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
    header: {
        height: 50,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        paddingHorizontal: 6,
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
    }
});
