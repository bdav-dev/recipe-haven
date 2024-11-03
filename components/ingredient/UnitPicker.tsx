import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { Unit } from "@/types/MiscellaneousTypes";
import { AppTheme } from "@/types/ThemeTypes";
import { unitToString } from "@/utils/UnitUtils";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

type UnitPickerProps = {
    selectedValue: Unit,
    onValueChange?: (itemValue: Unit, itemIndex: number) => void
}

export default function UnitPicker(props: UnitPickerProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    const unitValues = Object.values(Unit).filter(item => typeof item !== 'string');

    return (
        <Picker
            selectedValue={props.selectedValue}
            onValueChange={props.onValueChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
        >
            {
                unitValues.map(
                    unit => (
                        <Picker.Item
                            key={+unit}
                            label={unitToString(unit)}
                            value={unit}
                            color={theme.text}
                        />
                    )
                )
            }
        </Picker>
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