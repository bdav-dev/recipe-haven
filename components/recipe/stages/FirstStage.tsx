import CalorificValueInput from "@/components/ingredient/CalorificValueInput"
import UnitPicker from "@/components/ingredient/UnitPicker"
import TextField from "@/components/TextField"
import CardView from "@/components/themed/CardView"
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet"
import { useState } from "react"
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import { CalorificValue, Unit } from "@/types/IngredientTypes"
import Button from "@/components/Button"
import { AppTheme } from "@/types/ThemeTypes"

type FirstStageProps = {

}

const INITIAL_UNIT = Unit.GRAMM;
export default function FirstStage(props: FirstStageProps) {

    const styles = useThemedStyleSheet(createStyles);

    const [temporaryImageUri, setTemporaryImageUri] = useState<string>();
    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');
    const [unit, setUnit] = useState(INITIAL_UNIT);
    const [calorificValue, setCalorificValue] = useState<CalorificValue>();

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

    return (
        // All placeholder right now
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

    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    contentContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12
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