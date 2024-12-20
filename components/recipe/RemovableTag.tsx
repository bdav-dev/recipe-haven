import React from "react";
import AutoColorBadge from "../AutoColorBadge";
import { ThemedText } from "../themed/ThemedText";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


type RemovableTagProps = {
    tag: string,
    onPress?: () => void
}

export default function RemovableTag(props: RemovableTagProps) {

    return (
        <AutoColorBadge
            text={props.tag}
            content={
                color => <>
                    <ThemedText style={{ color }}>{props.tag}</ThemedText>
                    <TouchableWithoutFeedback onPress={props.onPress}>
                        <View>
                            <Ionicons name="close-outline" size={19} color={color} style={styles.icon} />
                        </View>
                    </TouchableWithoutFeedback>
                </>
            }
        />
    );
}

const styles = StyleSheet.create({
    icon: {
        marginLeft: 1
    }
});