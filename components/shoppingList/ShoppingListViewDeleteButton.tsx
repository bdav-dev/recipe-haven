import { StyleSheet, Alert } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import Button from '../Button';

type ShoppingListViewDeleteButtonProps = {
    onDelete: () => void;
    visible?: boolean;
}

export default function ShoppingListViewDeleteButton({ onDelete, visible }: ShoppingListViewDeleteButtonProps) {
    const theme = useAppTheme();

    if (!visible) return null;

    const triggerDelete = () => {
        Alert.alert(
            'Erledigte Einträge löschen', 
            'Möchtest du alle erledigten Einträge wirklich löschen?', 
            [
                {
                    text: 'Abbrechen'
                },
                {
                    text: 'Löschen',
                    onPress: onDelete,
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <Button 
            title="Löschen"
            ionicon="trash-outline"
            onPress={triggerDelete}
            type="destructive"
            style={[styles.deleteButton, { backgroundColor: theme.button.destructive }]}
            textStyle={styles.buttonText}
            iconColor="white"  // Add this line to make icon white
        />
    );
}

const styles = StyleSheet.create({
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        elevation: 3,
        width: 130,  // Same width as toggle button
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white'
    }
});
