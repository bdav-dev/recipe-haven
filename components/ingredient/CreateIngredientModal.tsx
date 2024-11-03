import { Button, Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useContext, useState } from "react";
import { IngredientContext } from "@/context/IngredientContextProvider";
import TextField from "../TextField";
import { Picker } from "@react-native-picker/picker";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import CardView from "../themed/CardView";
import * as ImagePicker from 'expo-image-picker';
import CalorificValueInput from "./CalorificValueInput";
import { isBlank } from "../../utils/StringUtils";
import { createIngredient } from "@/database/IngredientDao";
import { CalorificValue, Unit } from "@/types/MiscellaneousTypes";
import { AppTheme } from "@/types/ThemeTypes";

type CreateIngredientModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

const INITIAL_UNIT = Unit.GRAMM;

export default function CreateIngredientModal(props: CreateIngredientModalProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    const { ingredients, setIngredients } = useContext(IngredientContext);

    const [temporaryImageUri, setTemporaryImageUri] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');
    const [unit, setUnit] = useState(INITIAL_UNIT);
    const [calorificValue, setCalorificValue] = useState<CalorificValue | undefined>(undefined);

    function isReadyForSubmit() {
        return !isBlank(name);
    }

    async function pickImage() {
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!imagePickerResult.canceled) {
            setTemporaryImageUri(imagePickerResult.assets[0].uri);
        }
    }

    function reset() {
        setTemporaryImageUri(undefined);
        setName('');
        setPluralName('');
        setUnit(INITIAL_UNIT);
        setCalorificValue(undefined);
    }

    function close() {
        reset();
        if (props.onRequestClose)
            props.onRequestClose();
    }

    function submit() {
        createIngredient({
            name: name,
            pluralName: pluralName,
            unit: unit,
            temporaryImageUri: temporaryImageUri,
            calorificValue: calorificValue
        })
            .then(
                ingredient => {
                    close();
                    setIngredients(currentIngredients => [...currentIngredients, ingredient]);
                }
            );
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title={"Neue Zutat"}
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: () => submit(),
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.contentContainer}>

                <View style={styles.imageAndNamesContainer}>

                    <View style={styles.imagePlaceholder}>
                        <TouchableWithoutFeedback onPress={pickImage} onLongPress={() => setTemporaryImageUri(undefined)}>
                            {
                                temporaryImageUri
                                    ? <Image source={{ uri: temporaryImageUri }} style={styles.image} />
                                    : <Button title="Bild auswählen" onPress={pickImage} />
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
                            placeholder='Mehrzahlname'
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

                <CardView title="Brennwert" style={styles.caloriesCard}>
                    <CalorificValueInput initialValue={calorificValue} onValueChanged={setCalorificValue} unit={unit} />
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
