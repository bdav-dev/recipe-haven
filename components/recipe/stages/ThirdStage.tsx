import TextField from "@/components/TextField";
import CardView from "@/components/themed/CardView";
import { FrontendRecipeHolderContext } from "@/context/FrontendRecipeHolderContextProvider";
import { CREATE_EDIT_RECIPE_MODAL_COMMON_STYLES } from "@/styles/CommonStyles";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";


export default function ThirdStage() {
    const { states } = useContext(FrontendRecipeHolderContext);

    return (
        <View style={CREATE_EDIT_RECIPE_MODAL_COMMON_STYLES.stage}>
            <CardView title="Beschreibung">
                <TextField
                    multiline
                    numberOfLines={50}
                    style={styles.descriptionTextField}
                    scrollEnabled={false}
                    value={states.description.value}
                    onChangeText={states.description.set}
                />
            </CardView>
        </View>
    );
}

const styles = StyleSheet.create({
    descriptionTextField: {
        minHeight: 300,
        marginTop: 5,
        textAlign: "left",
        textAlignVertical: "top"
    }
});