import CalorificValueInput from "@/components/ingredient/CalorificValueInput"
import UnitPicker from "@/components/ingredient/UnitPicker"
import TextField from "@/components/TextField"
import CardView from "@/components/themed/CardView"
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet"
import { useEffect, useState } from "react"
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import Button from "@/components/Button"
import { AppTheme } from "@/types/ThemeTypes"
import DifficultyPicker from "../picker/DifficultyPicker"
import { RecipeDifficulty } from "@/types/RecipeTypes"
import { ThemedText } from "@/components/themed/ThemedText"
import { difficultyToString } from "@/utils/DifficultyUtils"
import AutoColorBadge from "@/components/AutoColorBadge"

type FirstStageProps = {

}

export default function FirstStage(props: FirstStageProps) {

    const styles = useThemedStyleSheet(createStyles);

    const [temporaryImageUri, setTemporaryImageUri] = useState<string>();
    const [name, setName] = useState('');

    const [difficulty, setDifficulty] = useState<RecipeDifficulty>();
    const [tags, setTags] = useState<string[]>([]);

    const [specialThingVisible, setSpecialThingVisible] = useState(false);

    const [tagInput, setTagInput] = useState("");

    useEffect(() => console.log(specialThingVisible), [specialThingVisible]);

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
        <View style={styles.contentContainer}>

            <View style={styles.imagePlaceholder}>
                <TouchableWithoutFeedback onPress={pickImage} onLongPress={() => setTemporaryImageUri(undefined)}>
                    {
                        temporaryImageUri
                            ? <Image source={{ uri: temporaryImageUri }} style={styles.image} />
                            : <Button title="Bild auswählen" onPress={pickImage} />
                    }
                </TouchableWithoutFeedback>
            </View>

            <TextField
                placeholder='Rezeptname'
                onChangeText={setName}
                style={[styles.nameTextField, styles.textField]}
            />


            <View style={{ flexDirection: "row", gap: 7 }}>
                <CardView title="Schwierigkeit" style={{ flex: 1, alignItems: "center" }}>
                    <DifficultyPicker value={difficulty} onValueChange={setDifficulty} />
                    <ThemedText>{difficultyToString(difficulty!)}</ThemedText>
                </CardView>
                <CardView title="Zubereitungsdauer" style={{ flex: 1, justifyContent: "center" }}>
                    
                    <View style={{ flexDirection: "row", alignItems:"flex-end", gap: 3 }}>
                        <TextField style={{flex: 1, maxWidth: 120, textAlign: "center"}}/>
                        <ThemedText style={{fontSize: 19, marginBottom: 3}}>h </ThemedText>
                        <TextField style={{flex: 1, maxWidth: 120, textAlign: "center"}}/>
                        <ThemedText style={{fontSize: 19,  marginBottom: 3}}>min</ThemedText>
                    </View>


                </CardView>
            </View>


            <CardView title="Tags" style={{ gap: 8 }}>
                <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
                    {
                        tags.map((tag, index) => <AutoColorBadge key={index} text={tag} />)
                    }
                </View>

                <View style={{ flexDirection: "row" }}>

                    <View style={{ backgroundColor: "red", position: "absolute", height: 150, bottom: 45, width: "100%", display: specialThingVisible ? "flex" : "none" }}>
                        <Button title="tello"/>
                        <ThemedText>Hello there!</ThemedText>
                        <ThemedText>Hello there!</ThemedText>
                        <ThemedText>Hello there!</ThemedText>
                    </View>

                    <TextField enablesReturnKeyAutomatically onFocus={() => setSpecialThingVisible(true)} onBlur={() => setSpecialThingVisible(false)} style={{ flex: 1 }} placeholder="Tagname" value={tagInput} onChangeText={setTagInput} onSubmitEditing={() => {
                        tags.push(tagInput);
                        setTagInput("");
                    }} />
                    <Button ionicon="add" title="" onPress={() => {
                        tags.push(tagInput);
                        setTagInput("");
                    }} />
                </View>
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