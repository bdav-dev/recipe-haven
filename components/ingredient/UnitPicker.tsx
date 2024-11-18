import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { Unit } from "@/types/IngredientTypes";
import { AppTheme } from "@/types/ThemeTypes";
import { unitFromValue, unitToString } from "@/utils/UnitUtils";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { StyleSheet } from "react-native";

type UnitPickerProps = {
    selectedValue: Unit,
    onValueChange?: (unit: Unit) => void
}

export default function UnitPicker(props: UnitPickerProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    const unitValues = Object.values(Unit).filter(item => typeof item !== 'string');

    function triggerOnValueChange(itemValue: ItemValue) {
        if(props.onValueChange) {
            props.onValueChange(
                unitFromValue(+itemValue) ?? Unit.GRAMM
            );
        }
    }

    return (
        <PickerIOS
            selectedValue={+props.selectedValue}
            onValueChange={triggerOnValueChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
        >
            {
                unitValues.map(
                    unit => (
                        <Picker.Item
                            key={+unit}
                            label={unitToString(unit)}
                            value={unit.valueOf()}
                            color={theme.text}
                        />
                    )
                )
            }
        </PickerIOS>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    picker: {
        color: theme.text,
        width: 200,
    },
    pickerItem: {
        fontSize: 18
    }
});