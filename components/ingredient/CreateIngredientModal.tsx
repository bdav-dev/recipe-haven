import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { useContext, useState } from "react";
import { IngredientContext } from "@/context/IngredientContextProvider";
import TextField from "../TextField";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import CardView from "../themed/CardView";
import * as ImagePicker from 'expo-image-picker';
import CalorificValueInput from "./CalorificValueInput";
import { isBlank } from "../../utils/StringUtils";
import { AppTheme } from "@/types/ThemeTypes";
import UnitPicker from "./UnitPicker";
import { CalorificValue, Unit } from "@/types/IngredientTypes";
import { createIngredient } from "@/data/dao/IngredientDao";
import Button from "../Button";
import FullScreenModal from "../modals/FullScreenModal";

type CreateIngredientModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

const INITIAL_UNIT = Unit.GRAMM;

export default function CreateIngredientModal(props: CreateIngredientModalProps) {
    const styles = useThemedStyleSheet(createStyles);

    const { setIngredients } = useContext(IngredientContext);

    const [temporaryImageUri, setTemporaryImageUri] = useState<string>();
    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');
    const [unit, setUnit] = useState(INITIAL_UNIT);
    const [calorificValue, setCalorificValue] = useState<CalorificValue>();

    function isReadyForSubmit() {
        return !isBlank(name);
    }

    async function pickImage() {
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
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
        props.onRequestClose?.();
    }

    function create() {
        createIngredient({
            name: name,
            pluralName: pluralName || undefined,
            unit: unit,
            temporaryImageUri: temporaryImageUri || undefined,
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
                onPress: () => create(),
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
                    <UnitPicker selectedUnit={unit} onUnitChange={(value) => setUnit(value)} />
                </CardView>

                <CardView title="Brennwert" style={styles.caloriesCard}>
                    <CalorificValueInput onValueChanged={setCalorificValue} unit={unit} />
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
        gap: 12,
        width: "100%",
    },
    imageAndNamesContainer: {
        flexDirection: "row",
    },
    namesContainer: {
        flexDirection: "column",
        flex: 1,
        paddingLeft: 12,
        justifyContent: "center",
        gap: 12
    },
    nameTextField: {
        fontSize: 28
    },
    imagePlaceholder: {
        display: "flex",
        justifyContent: "center",
        borderRadius: 10,
        width: 130,
        height: 130,
        borderWidth: 1,
        borderColor: theme.border
    },
    textField: {
        width: "100%"
    },
    caloriesCard: {
        height: 100,
        justifyContent: "flex-start",
        alignContent: "center"
    },
    unitCard: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 9
    }
});

export const createIngredientModalStyles = createStyles;