import TextField from "@/components/TextField"
import CardView from "@/components/themed/CardView"
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet"
import { useContext } from "react"
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import Button from "@/components/Button"
import { AppTheme } from "@/types/ThemeTypes"
import DifficultyPicker from "../picker/DifficultyPicker"
import { ThemedText } from "@/components/themed/ThemedText"
import { difficultyToString } from "@/utils/DifficultyUtils"
import React from "react"
import { isBlank } from "@/utils/StringUtils"
import { RecipeContext } from "@/context/RecipeContextProvider"
import { EditRecipeContext } from "@/context/EditRecipeContextProvider"
import { isInteger } from "@/utils/MathUtils"
import TagPicker from "../picker/TagPicker"
import PreparationTimePicker from "../picker/PreparationTimePicker"

export default function FirstStage() {
    const styles = useThemedStyleSheet(createStyles);

    const { states } = useContext(EditRecipeContext);
    const { recipes } = useContext(RecipeContext);

    const addTag = (tag: string) => states.tags.set(tags => [...tags, tag]);
    const removeTag = (tag: string) => states.tags.set(tags => tags.filter(t => t != tag));
    
    async function pickImage() {
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!imagePickerResult.canceled) {
            states.imageSrc.set(imagePickerResult.assets[0].uri);
        }
    }

    return (
        <View style={styles.contentContainer}>

            <View style={styles.imagePlaceholder}>
                <TouchableWithoutFeedback onPress={pickImage} onLongPress={states.imageSrc.clear}>
                    {
                        states.imageSrc.value
                            ? <Image source={{ uri: states.imageSrc.value }} style={styles.image} />
                            : <Button title="Bild auswählen" onPress={pickImage} />
                    }
                </TouchableWithoutFeedback>
            </View>

            <TextField
                placeholder='Rezeptname'
                value={states.recipeName.value}
                onChangeText={states.recipeName.set}
                style={[styles.nameTextField, styles.textField]}
            />

            <View style={{ flexDirection: "row", gap: 7 }}>

                <CardView title="Schwierigkeit" style={styles.difficultyPickerView}>
                    <DifficultyPicker value={states.difficulty.value} onValueChange={states.difficulty.set} />
                    <ThemedText>{difficultyToString(states.difficulty.value)}</ThemedText>
                </CardView>

                <CardView title="Zubereitungsdauer" style={styles.preparationTimePickerView}>
                    <PreparationTimePicker
                        hours={{
                            onChangeText: states.preparationTime.hours.set,
                            value: states.preparationTime.hours.value,
                            isErroneous: !isBlank(states.preparationTime.hours.value) && !isInteger(states.preparationTime.hours.value)
                        }}
                        minutes={{
                            onChangeText: states.preparationTime.minutes.set,
                            value: states.preparationTime.minutes.value,
                            isErroneous: !isBlank(states.preparationTime.minutes.value) && !isInteger(states.preparationTime.minutes.value)
                        }}
                    />
                </CardView>
            </View>

            <CardView title="Tags">
                <TagPicker
                    tags={states.tags.value}
                    tagSuggestions={recipes.flatMap(recipe => recipe.tags)}
                    onTagAdd={addTag}
                    onTagRemove={removeTag}
                    style={{marginTop: 6}}
                />
            </CardView>

        </View>

    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    preparationTimePickerView: {
        flex: 1, justifyContent: "center"
    },
    difficultyPickerView: {
        flex: 1,
        alignItems: "center"
    },
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
        width: "100%",
        justifyContent: "center",
        borderRadius: 10,
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