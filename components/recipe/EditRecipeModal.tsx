import { FrontendRecipeHolderContext } from "@/context/FrontendRecipeHolderContextProvider";
import { RecipeContext } from "@/context/RecipeContextProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, ScrollView, View } from "react-native";
import { createRecipeModalStyles, nextStage, previousStage, Stage, Stages } from "./CreateRecipeModal";
import { CreateRecipeBlueprint, Recipe } from "@/types/RecipeTypes";
import FullScreenModal from "../modals/FullScreenModal";
import StageInfo from "../StageInfo";
import FirstStage from "./stages/FirstStage";
import SecondStage from "./stages/SecondStage";
import ThirdStage from "./stages/ThirdStage";


type EditRecipeModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void,
    editRecipe?: Recipe
}

export default function EditRecipeModal(props: EditRecipeModalProps) {
    const { setRecipes } = useContext(RecipeContext);
    const { toRecipe, reset: resetRecipeHolderContext, mount } = useContext(FrontendRecipeHolderContext);
    const scrollViewRef = useRef<ScrollView>(null);

    const [stageWidth, setStageWidth] = useState(0);
    const [stage, setStage] = useState(Stages.ONE);

    const scrollToStage = (stage: Stage) => scrollViewRef.current?.scrollTo({ x: stageWidth * stage.index, animated: true });

    useEffect(() => {
        if (props.editRecipe)
            mount(props.editRecipe);
    }, [props.editRecipe]);

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
        resetRecipeHolderContext();
        setStage(Stages.ONE);
    }

    function close() {
        props.onRequestClose?.();
        reset();
    }

    function update() {
        let blueprint: CreateRecipeBlueprint;
        try {
            blueprint = toRecipe();
        } catch (error) {
            if (error instanceof Error) Alert.alert("Nicht so schnell!", error.message);
            return;
        }
        // TODO
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title="Rezept bearbeiten"
            onContentViewLayout={event => setStageWidth(event.nativeEvent.layout.width)}
            preScrollViewChildren={<StageInfo style={styles.stageInfo} stages={mapStagesForStageInfo()} />}
            customLeftButton={
                stage != Stages.ONE
                    ? { title: 'Zurück', onPress: () => setStage(previousStage(stage)!) }
                    : undefined
            }
            rightButton={
                stage == Stages.THREE
                    ? { title: 'Speichern', onPress: update }
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

const styles = createRecipeModalStyles;