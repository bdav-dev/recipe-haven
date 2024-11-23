import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { Unit } from "@/types/IngredientTypes";
import { AppTheme } from "@/types/ThemeTypes";
import { unitToString } from "@/utils/UnitUtils";
import { StyleSheet } from "react-native";
import SegmentedControl from "../segmentedControl/SegmentedControl";

type UnitPickerProps = {
    selectedUnit: Unit,
    onUnitChange?: (unit: Unit) => void
}

export default function UnitPicker(props: UnitPickerProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    const unitSegments = (
        Object.values(Unit)
            .filter(item => typeof item !== 'string')
            .map((unit, index) => ({ index, unit, label: unitToString(+unit)! }))
    );

    return (
        <SegmentedControl
            style={{ width: "100%" }}
            values={unitSegments.map(obj => obj.label)}
            selectedIndex={unitSegments.find(segment => segment.unit === props.selectedUnit)!.index}
            onChange={
                selectedIndex => (
                    props.onUnitChange && props.onUnitChange(unitSegments.find(segment => segment.index === selectedIndex)!.unit)
                )
            }
        />
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