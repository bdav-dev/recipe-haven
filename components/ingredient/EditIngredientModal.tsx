import { Alert, Image, TouchableWithoutFeedback, View } from "react-native";
import TextField from "../TextField";
import CardView from "../themed/CardView";
import UnitPicker from "./UnitPicker";
import CalorificValueInput from "./CalorificValueInput";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { createIngredientModalStyles } from "./CreateIngredientModal";
import { useContext, useEffect, useState } from "react";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { isBlank } from "@/utils/StringUtils";
import * as ImagePicker from 'expo-image-picker';
import { CalorificValue, Ingredient, Unit } from "@/types/IngredientTypes";
import { deleteIngredient, updateIngredient } from "@/data/dao/IngredientDao";
import Button from "../Button";
import FullScreenModal from "../modals/FullScreenModal";
import { RecipeContext } from "@/context/RecipeContextProvider";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";

type EditIngredientModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void,
    editIngredient?: Ingredient
}

export default function EditIngredientModal(props: EditIngredientModalProps) {
    const styles = useThemedStyleSheet(createIngredientModalStyles);

    const { ingredients, setIngredients } = useContext(IngredientContext);
    const { recipes } = useContext(RecipeContext);
    const { shoppingList } = useContext(ShoppingListContext);

    const [imageUri, setImageUri] = useState<string>();
    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');
    const [unit, setUnit] = useState(Unit.GRAMM);
    const [calorificValue, setCalorificValue] = useState<CalorificValue>();

    const [initialCalorificValue, setInitialCalorificValue] = useState<CalorificValue>();

    useEffect(() => {
        reset();
    }, [props.editIngredient]);

    function reset() {
        setImageUri(props.editIngredient?.imageSrc);
        setName(props.editIngredient?.name ?? '');
        setPluralName(props.editIngredient?.pluralName ?? '');
        setUnit(props.editIngredient?.unit ?? Unit.GRAMM);
        setCalorificValue(props.editIngredient?.calorificValue);
        setInitialCalorificValue(props.editIngredient?.calorificValue);
    }

    function close() {
        reset();
        props.onRequestClose?.();
    }

    async function pickImage() {
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!imagePickerResult.canceled) {
            setImageUri(imagePickerResult.assets[0].uri);
        }
    }

    function isReadyForSubmit() {
        return !isBlank(name);
    }

    function update() {
        if (ingredients.find(ingredient => (ingredient.name == name.trim()) && ingredient != props.editIngredient)) {
            Alert.alert("Eine Zutat mit diesem Namen existiert bereits");
            return;
        }

        updateIngredient({
            originalIngredient: props.editIngredient!,
            updatedValues: {
                imageSrc: imageUri,
                name: name,
                pluralName: pluralName || undefined,
                unit: unit,
                calorificValue: calorificValue
            }
        })
            .then(updatedIngredient => {
                setIngredients(ingredients => replaceIngredient(ingredients, updatedIngredient))
                close();
            });
    }

    function remove() {
        deleteIngredient(props.editIngredient!)
            .then(() => {
                setIngredients(ingredients => removeIngredient(ingredients, props.editIngredient!))
                close();
            });
    }

    function canIngredientBeDeleted(ingredient: Ingredient) {
        const isUsedInRecipe = (
            recipes
                .flatMap(recipe => recipe.ingredientsForOnePortion)
                .map(recipeIngredient => recipeIngredient.ingredient)
                .some(i => i.ingredientId == ingredient.ingredientId)
        );

        const isUsedInShoppingList = (
            shoppingList.ingredientItems
                .map(ingredientItem => ingredientItem.ingredient.ingredient)
                .some(i => i.ingredientId == ingredient.ingredientId)
        );

        return !isUsedInRecipe && !isUsedInShoppingList;
    }

    function showConfirmDeleteAlert() {
        if (!props.editIngredient) return;

        if (!canIngredientBeDeleted(props.editIngredient)) {
            Alert.alert(
                'Zutat kann nicht gelöscht werden',
                'Diese Zutat kann nicht gelöscht werden, da sie noch verwendet wird.'
            );
            return;
        }

        Alert.alert('Zutat löschen', 'Möchtest du diese Zutat wirklich löschen?', [
            {
                text: 'Abbrechen'
            },
            {
                text: 'Löschen',
                onPress: remove,
                style: "destructive"
            }
        ]);
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title={"Zutat bearbeiten"}
            rightButton={{
                title: "Speichern",
                onPress: () => update(),
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.contentContainer}>

                <View style={styles.imageAndNamesContainer}>

                    <View style={styles.imagePlaceholder}>
                        <TouchableWithoutFeedback onPress={pickImage} onLongPress={() => setImageUri(undefined)}>
                            {
                                imageUri
                                    ? <Image source={{ uri: imageUri }} style={styles.image} />
                                    : <Button title="Bild auswählen" onPress={pickImage} />
                            }
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={styles.namesContainer}>
                        <TextField
                            placeholder='Name'
                            onChangeText={setName}
                            style={[styles.nameTextField, styles.textField]}
                        >
                            {props.editIngredient?.name}
                        </TextField>
                        <TextField
                            placeholder='Mehrzahlname'
                            onChangeText={setPluralName}
                            style={styles.textField}
                        >
                            {props.editIngredient?.pluralName}
                        </TextField>
                    </View>
                </View>

                <CardView title="Einheit" style={styles.unitCard}>
                    <UnitPicker selectedUnit={unit} onUnitChange={value => setUnit(value)} />
                </CardView>

                <CardView title="Brennwert" style={styles.caloriesCard}>
                    <CalorificValueInput initialValue={initialCalorificValue} onValueChanged={setCalorificValue} unit={unit} style={styles.calorificValue} />
                </CardView>

                <Button style={{ marginTop: 4 }} title="Zutat löschen" ionicon="trash-outline" type="destructive" onPress={showConfirmDeleteAlert} />

            </View>

        </FullScreenModal>
    );
}

function replaceIngredient(ingredients: Ingredient[], replacement: Ingredient) {
    return ingredients.map(
        ingredient => (
            ingredient.ingredientId === replacement.ingredientId
                ? replacement
                : ingredient
        )
    );
}

function removeIngredient(ingredients: Ingredient[], ingredientToRemove: Ingredient) {
    return ingredients.filter(
        ingredient => ingredient.ingredientId !== ingredientToRemove.ingredientId
    );
}