import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import { ThemedText } from "./themed/ThemedText";
import Button from "./Button";

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
                        <Button title="Schließen" onPress={props.onRequestClose} style={styles.headerButton} />

                        {
                            typeof props.title === 'string'
                                ? <View style={styles.headerTitleContainer}>
                                    <ThemedText type="subtitle" style={styles.headerTitle}>{props.title}</ThemedText>
                                </View>
                                : props.title
                        }

                        {props.primaryActionButton 
                            ? <Button
                                style={styles.headerButton}
                                title={props.primaryActionButton.title}
                                onPress={props.primaryActionButton.onPress}
                                disabled={props.primaryActionButton.disabled}
                              />
                            : <View style={styles.headerButton} />  
                        }
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {props.children}
                    </ScrollView>

                </KeyboardAvoidingView>

            </View>

        </Modal>
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
        zIndex: 2,
        minWidth: 80
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
