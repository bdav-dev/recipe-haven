import { Alert, Keyboard, ScrollView, StyleSheet, View } from "react-native";
import FullScreenModal from "../modals/FullScreenModal";
import { useContext, useEffect, useRef, useState } from "react";
import FirstStage from "./stages/FirstStage";
import StageInfo from "../StageInfo";
import { FrontendRecipeHolderContext } from "@/context/FrontendRecipeHolderContextProvider";
import SecondStage from "./stages/SecondStage";
import ThirdStage from "./stages/ThirdStage";
import { CreateRecipeBlueprint } from "@/types/RecipeTypes";
import { createRecipe } from "@/data/dao/RecipeDao";
import { RecipeContext } from "@/context/RecipeContextProvider";

type CreateRecipeModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void
}

export type Stage = {
    index: number,
    title: string
}

export const Stages: { [key: string]: Stage } = {
    ONE: { index: 0, title: 'Allgemein' },
    TWO: { index: 1, title: 'Zutaten' },
    THREE: { index: 2, title: 'Beschreibung' }
}
export const previousStage = (stage: Stage) => Object.values(Stages).find(otherStage => otherStage.index == stage.index - 1);
export const nextStage = (stage: Stage) => Object.values(Stages).find(otherStage => otherStage.index == stage.index + 1);

export default function CreateRecipeModal(props: CreateRecipeModalProps) {
    const { setRecipes } = useContext(RecipeContext);
    const { toRecipe, reset: resetRecipeHolderContext } = useContext(FrontendRecipeHolderContext);
    const scrollViewRef = useRef<ScrollView>(null);

    const [stageWidth, setStageWidth] = useState(0);
    const [stage, setStage] = useState(Stages.ONE);

    const scrollToStage = (stage: Stage) => scrollViewRef.current?.scrollTo({ x: stageWidth * stage.index, animated: true });

    useEffect(() => {
        Keyboard.dismiss();
        scrollToStage(stage);
    }, [stage]);

    const mapStagesForStageInfo = () => (
        Object.values(Stages)
            .map(otherStage => ({
                title: otherStage.title,
                isActive: otherStage.index == stage.index,
                isFilled: otherStage.index < stage.index,
                onPress: () => setStage(otherStage)
            }))
    );

    function reset() {
        setStage(Stages.ONE);
        resetRecipeHolderContext();
    }

    function close() {
        props.onRequestClose?.();
        reset();
    }

    function create() {
        let blueprint: CreateRecipeBlueprint;
        try {
            blueprint = toRecipe();
        } catch (error) {
            if (error instanceof Error) Alert.alert("Nicht so schnell!", error.message);
            return;
        }

        createRecipe(blueprint)
            .then(recipe => {
                close();
                setRecipes(recipes => [...recipes, recipe]);
            })
            .catch(console.log);
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title="Neues Rezept"
            onContentViewLayout={event => setStageWidth(event.nativeEvent.layout.width)}
            preScrollViewChildren={<StageInfo style={styles.stageInfo} stages={mapStagesForStageInfo()} />}
            customLeftButton={
                stage != Stages.ONE
                    ? { title: 'Zurück', onPress: () => setStage(previousStage(stage)!) }
                    : undefined
            }
            rightButton={
                stage == Stages.THREE
                    ? { title: 'Hinzufügen', onPress: create }
                    : { title: 'Weiter', onPress: () => setStage(nextStage(stage)!) }
            }
        >
            <ScrollView
                ref={scrollViewRef}
                horizontal pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={styles.stageViewContent}
                style={styles.stageView}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ width: stageWidth }}>
                    <FirstStage />
                </View>

                <View style={{ width: stageWidth }}>
                    <SecondStage />
                </View>
                <View style={{ width: stageWidth }}>
                    <ThirdStage />
                </View>
            </ScrollView>
        </FullScreenModal>
    );
}

const styles = StyleSheet.create({
    stageView: {
        flex: 1
    },
    stageViewContent: {
        flexDirection: "row"
    },
    stageInfo: {
        margin: 5
    },
    container: {
        flex: 1
    },
    viewItem: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10
    }
});
export const createRecipeModalStyles = styles;
