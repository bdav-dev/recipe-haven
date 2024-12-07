import { ScrollView, StyleSheet, View } from "react-native";
import FullScreenModal from "../modals/FullScreenModal";
import { ThemedText } from "../themed/ThemedText";
import { useRef, useState } from "react";
import Button from "../Button";
import FirstStage from "./stages/FirstStage";
import StageInfo from "../StageInfo";
import { useAppTheme } from "@/hooks/useAppTheme";


type CreateRecipeModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

enum Stage {
    ONE, // image, title, preparatuib time, diffuiculty, tags
    TWO, // ingredients
    THREE // description
}

export default function CreateRecipeModal(props: CreateRecipeModalProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const theme = useAppTheme();

    const [stageView, setStageWidth] = useState(0);
    const switchToStage = (view: Stage) => scrollViewRef.current?.scrollTo({ x: stageView * view, animated: true });

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title="Neues Rezept"
            onContentViewLayout={event => setStageWidth(event.nativeEvent.layout.width)}
            preScrollViewChildren={<StageInfo stages={["Allgemein", "Zutaten", "Beschreibung"]}/>}
        >
            
            

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={styles.scrollViewContent}
                style={{ flex: 1 }}
            >
                <View style={{ width: stageView }}>
                    <FirstStage/>
                </View>

                <View style={{ width: stageView, backgroundColor: "blue" }}>
                    <ThemedText>2</ThemedText>
                </View>
                <View style={{ width: stageView, backgroundColor: "green" }}>
                    <ThemedText>3</ThemedText>
                </View>

            </ScrollView>

            <Button title="one" onPress={() => switchToStage(Stage.ONE)} />
            <Button title="two" onPress={() => switchToStage(Stage.TWO)} />
            <Button title="three" onPress={() => switchToStage(Stage.THREE)} />
        </FullScreenModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollViewContent: {
        flexDirection: "row"
    },
    viewItem: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10
    }
});
