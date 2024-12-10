import { LayoutChangeEvent, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { useState } from "react";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { useAppTheme } from "@/hooks/useAppTheme";

type StageInfoProps = {
    stages: Stage[],
    onBackgroundColor?: string,
    style?: ViewStyle,
}

type Stage = {
    title: string,
    onPress?: () => void,
    isFilled?: boolean,
    isActive?: boolean
}

export default function StageInfo(props: StageInfoProps) {
    const [firstStageX, setFirstStageX] = useState(0);
    const [lastStageX, setLastStageX] = useState(0);
    const [stageInfoWidth, setStageInfoWidth] = useState(0);

    const onStageInfoLayout = (event: LayoutChangeEvent) => setStageInfoWidth(event.nativeEvent.layout.width);
    const onFirstStageLayout = (event: LayoutChangeEvent) => setFirstStageX(event.nativeEvent.layout.x);
    const onLastStageLayout = (event: LayoutChangeEvent) => setLastStageX(event.nativeEvent.layout.x);

    const getLayout = (index: number) => {
        if (index == 0) {
            return onFirstStageLayout;
        } else if (index == props.stages.length - 1) {
            return onLastStageLayout;
        }
        return undefined;
    };

    return (
        <View style={[stageInfoStyles.stageInfo, props.style]} onLayout={onStageInfoLayout}>
            <Line width={stageInfoWidth / 2} right={lastStageX + 1} />
            <Line width={stageInfoWidth / 2} left={firstStageX} />
            {
                props.stages.map((item, index) => (
                    <Stage
                        key={index}
                        onBackgroundColor={props.onBackgroundColor}
                        stage={item}
                        onLayout={getLayout(index)}
                    />
                )
                )
            }
        </View>
    );
}

function Line({ left, right, width }: { left?: number, right?: number, width: number }) {
    const styles = useThemedStyleSheet(createLineStyles);

    return (
        <View style={[
            styles.line,
            {
                width, left, right,
                top: (OUTER_DOT_SIZE / 2) - (LINE_WIDTH / 2),
                height: LINE_WIDTH,
            }
        ]}
        />
    );
}

function Stage(props: { stage: Stage, onBackgroundColor?: string, onLayout?: (event: LayoutChangeEvent) => void }) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStageStyles);
    const borderColor = props.onBackgroundColor ?? theme.background;
    const backgroundColor =
        props.stage.isActive
            ? theme.button.default
            : (
                props.stage.isFilled
                    ? theme.border
                    : borderColor
            );

    return (
        <TouchableWithoutFeedback onPress={props.stage.onPress}>
            <View style={styles.stageView} >
                <View style={[styles.stageDot, { borderColor }]} onLayout={props.onLayout}>
                    <View style={[styles.stageInnerDot, { borderColor, backgroundColor }]} />
                </View>
                <ThemedText>{props.stage.title}</ThemedText>
            </View>
        </TouchableWithoutFeedback>
    );

}

const LINE_WIDTH = 2;
const OUTER_DOT_SIZE = 30;
const DOT_MARGIN = 2.5;
const INNER_DOT_MARGIN_OFFSET = 2;
const INNER_DOT_OFFSET = DOT_MARGIN * 4;
const createStageStyles = (theme: AppTheme) => StyleSheet.create({
    stageView: {
        alignItems: "center"
    },
    stageDot: {
        width: OUTER_DOT_SIZE,
        height: OUTER_DOT_SIZE,
        borderRadius: 999,
        backgroundColor: theme.border,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: DOT_MARGIN
    },
    stageInnerDot: {
        width: OUTER_DOT_SIZE - INNER_DOT_OFFSET,
        height: OUTER_DOT_SIZE - INNER_DOT_OFFSET,
        borderRadius: 999,
        borderWidth: DOT_MARGIN + INNER_DOT_MARGIN_OFFSET
    }
});

const createLineStyles = (theme: AppTheme) => StyleSheet.create({
    line: {
        position: "absolute",
        backgroundColor: theme.border
    }
});

const stageInfoStyles = StyleSheet.create({
    stageInfo: {
        flexDirection: "row",
        gap: 20
    }
});
