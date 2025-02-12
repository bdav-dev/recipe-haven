/**
 * THIS CODE WAS COPIED FROM THE GITHUB REPOSITORY
 * react-native-segmented-control/segmented-control (https://github.com/react-native-segmented-control/segmented-control)
 */

import type { StyleProp, ViewStyle as ReactNativViewStyle, ColorValue, ViewProps } from 'react-native/';

export type ViewStyle = StyleProp<ReactNativViewStyle>;

export type FontStyle = {
    /**
     * Font Color of Segmented Control
     */
    color?: ColorValue,
    /**
     * Font Size of Segmented Control
     */
    fontSize?: number,
    /**
     * Font Family of the Segmented Control
     */
    fontFamily?: string,
    /**
     * Font Weight of the Segmented Control
     */
    fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900',
};


export type SegmentedControlProps = ViewProps & {
    /**
     * The labels for the control's segment buttons, in order.
     */
    values: Array<string | number | Object>,
    /**
     * The index in `props.values` of the segment to be (pre)selected.
     */
    selectedIndex?: number,
    /**
     * Callback that is called when the user taps a segment;
     * passes the segment's value as an argument
     */
    onValueChange?: (value: string | number | Object) => any,
    /**
     * Callback that is called when the user taps a segment;
     * passes the segment's index as an argument
     */
    onChange?: (index: number) => any,
    /**
     * If false the user won't be able to interact with the control.
     * Default value is true.
     */
    enabled?: boolean,
    /**
     * Accent color of the control.
     */
    tintColor?: string,

    /**
     * (iOS 13+ only)
     * Background color of the control.
     */
    backgroundColor?: string,
    /**
     * If true, then selecting a segment won't persist visually.
     * The `onValueChange` callback will still work as expected.
     */
    momentary?: boolean,
    /**
     * (iOS 13+ only, Android, Web)
     * Overrides the control's appearance irrespective of the OS theme
     */
    appearance?: 'dark' | 'light',
    /**
     * (iOS 13+ only, Android, Web)
     * fontStyle for segmented control.
     */
    fontStyle?: FontStyle,
    /**
     * (iOS 13+ only)
     * activeFontStyle for selected segment.
     * it will override fontStyle for the selected segment
     */
    activeFontStyle?: FontStyle,

    /**
     * Touchable style properties for Segmented Control Tab
     */
    tabStyle?: ViewStyle,

    /**
     * array testID to each segment button
     */
    testIDS?: Array<string>,
};