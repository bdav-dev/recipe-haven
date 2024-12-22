import { StyleSheet, Alert, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import Button from '../Button';
import FloatingActionButton from '../FloatingActionButton';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed/ThemedText';

type ShoppingListViewDeleteButtonProps = {
    onDelete: () => void
}

export default function ShoppingListViewDeleteButton({ onDelete }: ShoppingListViewDeleteButtonProps) {
    const theme = useAppTheme();


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
        <FloatingActionButton position='right' color={theme.button.destructive} onPress={onDelete} round={false}>
            <View style={styles.content}>
                <Ionicons name='trash-outline' size={22} color={"white"} />
                <ThemedText style={styles.text}>{"Löschen"}</ThemedText>
            </View>
        </FloatingActionButton>


        // <Button 
        //     title="Löschen"
        //     ionicon="trash-outline"
        //     onPress={triggerDelete}
        //     type="destructive"
        //     style={[styles.deleteButton, { backgroundColor: theme.button.destructive }]}
        //     textStyle={styles.buttonText}
        //     iconColor="white"  // Add this line to make icon white
        // />
    );
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 6
    },
    text: {
        color: "white"
    }
});
