import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import FullScreenModal from "../modals/FullScreenModal";
import { ThemedText } from "../themed/ThemedText";
import { useEffect, useRef, useState } from "react";
import FirstStage from "./stages/FirstStage";
import StageInfo from "../StageInfo";


type CreateRecipeModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

type Stage = {
    index: number,
    title: string
}

const Stages: { [key: string]: Stage } = {
    ONE: { index: 0, title: 'Allgemein' },
    TWO: { index: 1, title: 'Zutaten' },
    THREE: { index: 2, title: 'Beschreibung' }
}
const previousStage = (stage: Stage) => Object.values(Stages).find(otherStage => otherStage.index == stage.index - 1);
const nextStage = (stage: Stage) => Object.values(Stages).find(otherStage => otherStage.index == stage.index + 1);

export default function CreateRecipeModal(props: CreateRecipeModalProps) {
    const scrollViewRef = useRef<ScrollView>(null);

    const [stageView, setStageWidth] = useState(0);
    const scrollToStage = (view: Stage) => scrollViewRef.current?.scrollTo({ x: stageView * view.index, animated: true });

    const [stage, setStage] = useState(Stages.ONE);

    useEffect(() => {
        Keyboard.dismiss();
        scrollToStage(stage);
    }, [stage]);

    const mapStages = () => (
        Object.values(Stages)
            .map(otherStage => ({
                title: otherStage.title,
                isActive: otherStage.index == stage.index,
                isFilled: otherStage.index < stage.index,
                onPress: () => setStage(otherStage)
            }))
    );

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title="Neues Rezept"
            onContentViewLayout={event => setStageWidth(event.nativeEvent.layout.width)}
            preScrollViewChildren={
                <StageInfo style={{ margin: 5 }} stages={mapStages()} />
            }
            customCloseButton={
                stage != Stages.ONE
                    ? { title: 'Zurück', onPress: () => setStage(previousStage(stage)!) }
                    : undefined
            }
            primaryActionButton={
                stage == Stages.THREE
                    ? { title: 'Hinzufügen', onPress: () => { } }
                    : { title: 'Weiter', onPress: () => setStage(nextStage(stage)!) }
            }
        >
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={styles.scrollViewContent}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ width: stageView }}>
                    <FirstStage />
                </View>

                <View style={{ width: stageView, backgroundColor: "blue" }}>
                    <ThemedText>2</ThemedText>
                </View>
                <View style={{ width: stageView, backgroundColor: "green" }}>
                    <ThemedText>3</ThemedText>
                </View>

            </ScrollView>
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
