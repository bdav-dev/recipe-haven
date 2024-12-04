import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import Button from '../Button';

type ShoppingListViewToggleProps = {
    showChecked: boolean;
    onToggle: () => void;
    visible?: boolean;
}

export default function ShoppingListViewToggle({ showChecked, onToggle, visible }: ShoppingListViewToggleProps) {
    const theme = useAppTheme();

    if (!visible) return null;

    return (
        <Button 
            title={showChecked ? "Erledigte anzeigen" : "Offene anzeigen"}
            onPress={onToggle}
            style={[styles.toggleButton, { backgroundColor: theme.accent }]}
        />
    );
}

const styles = StyleSheet.create({
    toggleButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 5,
    },
    toggleButtonText: {
        fontSize: 16,
        fontWeight: '600'
    }
});
