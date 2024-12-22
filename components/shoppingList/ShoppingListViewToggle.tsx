import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import FloatingActionButton from '../FloatingActionButton';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed/ThemedText';

type ShoppingListViewToggleProps = {
    showChecked: boolean;
    onToggle: () => void;
}

export default function ShoppingListViewToggle({ showChecked, onToggle }: ShoppingListViewToggleProps) {
    const theme = useAppTheme();

    return (
        <FloatingActionButton position='left' color={theme.button.default} onPress={onToggle} round={false}>
            <View style={styles.content}>
                <Ionicons name='list-outline' size={22} color={"white"} />
                <ThemedText style={styles.text}>{showChecked ? "Offene" : "Erledigte"}</ThemedText>
            </View>
        </FloatingActionButton>
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
