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
            title="Erledigte löschen"
            onPress={triggerDelete}
            type="destructive"
            style={[styles.deleteButton, { backgroundColor: theme.accent }]}
        />
    );
}

const styles = StyleSheet.create({
    deleteButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 5,
    }
});
