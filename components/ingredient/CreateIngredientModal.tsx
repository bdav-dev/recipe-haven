import { Button, StyleSheet, View } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useContext, useMemo, useState } from "react";
import { insertIngredient } from "@/database/IngredientDao";
import { IngredientContext } from "@/context/IngredientContextProvider";
import TextField from "../TextField";
import { Picker } from "@react-native-picker/picker";
import { AppTheme, useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { Ingredient, Unit, unitToString } from "@/types/MainAppTypes";
import { ThemedText } from "../themed/ThemedText";

type CreateIngredientModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

export default function CreateIngredientModal(props: CreateIngredientModalProps) {
    const { ingredients, setIngredients } = useContext(IngredientContext);

    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    const [kcalPerUnit, setKcalPerUnit] = useState('');

    const theme = useAppTheme();
    const styles = useThemedStyleSheet(theme => createStyles(theme));

    const [unit, setUnit] = useState(Unit.GRAMM);


    function submit() {
        const ingredient: Ingredient = {
            name: name,
            pluralName: pluralName || undefined,
            imageSrc: imageSrc || undefined,
            unit: Number(unit),
            kcalPerUnit: Number(kcalPerUnit)
        };

        insertIngredient(ingredient)
            .then(() => {
                setIngredients(current => [...current, ingredient])
            });
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
                    <View style={styles.imgPlaceholder}></View>

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


                <View style={styles.a}>
                    <Picker selectedValue={unit} onValueChange={(value, index) => setUnit(value ?? Unit.GRAMM)} style={styles.picker} itemStyle={styles.pickerItem}>
                        <Picker.Item label="Gramm" value={Unit.GRAMM} color={theme.text} />
                        <Picker.Item label="Liter" value={Unit.LITER} color={theme.text} />
                        <Picker.Item label="Stück" value={Unit.PIECE} color={theme.text} />
                    </Picker>

                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <TextField placeholder='kcal' onChangeText={setKcalPerUnit} style={styles.smallTextField} />
                    <ThemedText>kcal pro</ThemedText>
                    <TextField placeholder={unitToString(unit)} onChangeText={setKcalPerUnit} style={styles.smallTextField} />
                    <ThemedText>{unitToString(unit)}</ThemedText>
                </View>

            </View>

        </FullScreenModal>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    contentContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1
    },
    imageAndNamesContainer: {
        flexDirection: "row",
    },
    namesContainer: {
        flexDirection: "column",
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: "center",
        gap: 7
    },

    smallTextField: {
        minWidth: 80,
        textAlign: "center"
    },

    nameTextField: {
        fontSize: 28
    },

    picker: {
        color: theme.text,
        width: 200
    },

    pickerItem: {
        fontSize: 18
    },

    imgPlaceholder: {
        borderRadius: 10,
        width: 130,
        height: 130,
        backgroundColor: "red"
    },
    textField: {
        width: "100%"
    },
    a: {
        backgroundColor: theme.card
    }
});
