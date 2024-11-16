import { useContext, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import Page from '@/components/Page';
import FloatingActionButton from '@/components/FloatingActionButton';
import SelectShoppingListItemTypeModal from '@/components/shoppingList/SelectShoppingListItemTypeModal';
import { ShoppingListContext } from '@/context/ShoppingListContextProvider';
import CustomShoppingListItem from '@/components/shoppingList/CustomShoppingListItem';
import { ShoppingListCustomItem } from '@/types/ShoppingListTypes';
import { updateCustomItem } from '@/data/dao/ShoppingListDao';

export default function ShoppingListScreen() {
    const theme = useAppTheme();
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    const [isSelectTypeModalVisible, setIsSelectTypeModalVisible] = useState(false);

    function handleToggleCheck(item: ShoppingListCustomItem) {
        const updatedItem = {
            ...item,
            isChecked: !item.isChecked
        };

        updateCustomItem({
            originalItem: item,
            updatedValues: updatedItem
        }).then(() => {
            const updatedItems = shoppingList.customItems.map(existingItem =>
                existingItem.shoppingListCustomItemId === item.shoppingListCustomItemId
                    ? updatedItem
                    : existingItem
            );

            setShoppingList({
                ...shoppingList,
                customItems: updatedItems
            });
        });
    }

    return (
        <Page>
            <FlatList
                data={shoppingList.customItems}
                style={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={listItemInfo => (
                  <CustomShoppingListItem
                      key={listItemInfo.index}
                      item={listItemInfo.item}
                      onToggleCheck={handleToggleCheck}
                  />
              )}
            />

            <FloatingActionButton onPress={() => setIsSelectTypeModalVisible(true)}>
                <Ionicons name='add-outline' color={theme.card} size={35} />
            </FloatingActionButton>

            <SelectShoppingListItemTypeModal
                isVisible={isSelectTypeModalVisible}
                onRequestClose={() => setIsSelectTypeModalVisible(false)}
            />
        </Page>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 8
    }
});