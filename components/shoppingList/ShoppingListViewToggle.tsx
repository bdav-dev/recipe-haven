import { StyleSheet } from 'react-native';
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
            title={showChecked ? "Erledigte" : "Offene"}
            ionicon="list-outline"  // Added icon for consistency
            onPress={onToggle}
            style={[styles.toggleButton, { backgroundColor: theme.button.default }]}
            textStyle={styles.buttonText}
            type="normal"
            iconColor="white"  // Add this line to make icon white
        />
    );
}

const styles = StyleSheet.create({
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: "black",
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.15,
        elevation: 3,
        width: 130, // Same width as delete button
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white'
    }
});
