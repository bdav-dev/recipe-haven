import AutoColorBadge from "@/components/AutoColorBadge";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { alphabetically, distinctValue, startsWithIgnoringCase } from "@/utils/StreamUtils";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import RemovableTag from "../RemovableTag";
import { isBlank } from "@/utils/StringUtils";


type TagPickerProps = {
    tags: string[],
    tagSuggestions: string[],
    onTagAdd: (tag: string) => void,
    onTagRemove: (tag: string) => void,
    style?: ViewStyle
}

export default function TagPicker(props: TagPickerProps) {
    const [tagSuggestionsVisible, setTagSuggestionsVisible] = useState(false);
    const [tagInput, setTagInput] = useState('');

    function addTag(tag: string) {
        if (isBlank(tag)) {
            return;
        }

        const isTagAlreadyPresent = props.tags.some(t => t == tag);
        if (!isTagAlreadyPresent) {
            props.onTagAdd(tag);
        }
        setTagInput('');
    }

    function addTagFromTagInput() {
        addTag(tagInput.trim());
    }

    return (
        <View style={[styles.tagPickerView, props.style]}>
            <View style={styles.addTagsView}>
                <TextField
                    enablesReturnKeyAutomatically
                    onFocus={() => setTagSuggestionsVisible(true)}
                    onBlur={() => setTagSuggestionsVisible(false)}
                    style={styles.tagInput}
                    placeholder="Tagname"
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={addTagFromTagInput}
                />
                <Button ionicon="add" title="" onPress={addTagFromTagInput} />

                <View style={[styles.tagSuggestionView, { display: tagSuggestionsVisible ? "flex" : "none" }]}>
                    {
                        props.tagSuggestions
                            .filter(distinctValue)
                            .filter(tag => !props.tags.includes(tag))
                            .filter(tag => startsWithIgnoringCase(tag, tagInput))
                            .sort(alphabetically)
                            .map(
                                (tag, index) =>
                                    <TouchableOpacity key={index} onPress={() => addTag(tag)}>
                                        <AutoColorBadge text={tag} />
                                    </TouchableOpacity>
                            )
                    }
                </View>
            </View>

            <View style={styles.tagsView}>
                {
                    props.tags.map((tag, index) => <RemovableTag tag={tag} onPress={() => props.onTagRemove(tag)} key={index} />)
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tagsView: {
        flexDirection: "row", gap: 4, flexWrap: "wrap"
    },
    tagSuggestionView: {
        position: "absolute",
        bottom: 40,
        width: "100%",
        overflow: "hidden",
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 3
    },
    tagInput: {
        flex: 1
    },
    tagPickerView: {
        gap: 8
    },
    addTagsView: {
        flexDirection: "row"
    }
});