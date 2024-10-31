import { Button, Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useContext, useState } from "react";
import { IngredientContext } from "@/context/IngredientContextProvider";
import TextField from "../TextField";
import { Picker } from "@react-native-picker/picker";
import { AppTheme, useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { Unit } from "@/types/MainAppTypes";
import CardView from "../themed/CardView";
import * as ImagePicker from 'expo-image-picker';
import CalorieInput from "./CalorieInput";

type CreateIngredientModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

export default function CreateIngredientModal(props: CreateIngredientModalProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(theme => createStyles(theme));

    const { ingredients, setIngredients } = useContext(IngredientContext);

    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');
    

    const [unit, setUnit] = useState(Unit.GRAMM);

    const [imageUri, setImageUri] = useState<string | null>(null);

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title={"Neue Zutat"}
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: () => { }
            }}
        >
            <View style={styles.contentContainer}>

                <View style={styles.imageAndNamesContainer}>

                    <View style={styles.imagePlaceholder}>
                        <TouchableWithoutFeedback onPress={pickImage} onLongPress={() => setImageUri(null)}>
                            {
                                imageUri == null
                                    ? <Button title="Bild auswählen" onPress={pickImage} />
                                    : <Image source={{ uri: imageUri }} style={styles.image} />
                            }
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={styles.namesContainer}>
                        <TextField
                            placeholder='Name'
                            onChangeText={setName}
                            style={[styles.nameTextField, styles.textField]}
                        />
                        <TextField
                            placeholder='Mehrzahlname (optional)'
                            onChangeText={setPluralName}
                            style={styles.textField}
                        />
                    </View>
                </View>

                <CardView title="Einheit" style={styles.unitCard}>
                    <Picker selectedValue={unit} onValueChange={(value, index) => setUnit(value ?? Unit.GRAMM)} style={styles.picker} itemStyle={styles.pickerItem}>
                        <Picker.Item label="Stück" value={Unit.PIECE} color={theme.text} />
                        <Picker.Item label="Gramm" value={Unit.GRAMM} color={theme.text} />
                        <Picker.Item label="Liter" value={Unit.LITER} color={theme.text} />
                    </Picker>
                </CardView>

                <CardView title="Kalorienangabe" style={styles.caloriesCard}>
                    <CalorieInput unit={unit}/>
                </CardView>

            </View>

        </FullScreenModal>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    contentContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
    },
    imageAndNamesContainer: {
        flexDirection: "row",
    },
    namesContainer: {
        flexDirection: "column",
        flex: 1,
        paddingLeft: 8,
        justifyContent: "center",
        gap: 7
    },

    

    nameTextField: {
        fontSize: 28
    },

    picker: {
        color: theme.text,
        width: 200,
    },

    pickerItem: {
        fontSize: 18
    },

    imagePlaceholder: {
        display: "flex",
        justifyContent: "center",
        borderRadius: 10,
        width: 140,
        height: 140,
        borderWidth: 1,
        borderColor: theme.border
    },
    textField: {
        width: "100%"
    },
    caloriesCard: {
        height: 100,
        padding: 0,
        paddingTop: 0,
        justifyContent: "center",
        alignContent: "center"
    },
    unitCard: {
        padding: 0,
        paddingTop: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10
    }
});
