import { Button, Modal, StyleSheet, View } from "react-native";

type CustomModalProps = {
    children?: React.ReactNode,
    isVisible: boolean,
    onRequestClose?: () => void
}

export default function CustomModal(props: CustomModalProps) {

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.onRequestClose}
            
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {props.children}
                    <Button title="close" onPress={props.onRequestClose}/>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        width: "85%",

        backgroundColor: "gray",
        borderRadius: 20,
        padding: 20,
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});