import { useContext, useState, useMemo } from 'react';
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
import ShoppingListViewToggle from '@/components/shoppingList/ShoppingListViewToggle';
import { ThemeProvider } from '@react-navigation/native';

export default function ShoppingListScreen() {
    const theme = useAppTheme();
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    const [isSelectTypeModalVisible, setIsSelectTypeModalVisible] = useState(false);
    const [showCheckedItems, setShowCheckedItems] = useState(false);

    const filteredItems = useMemo(() => 
        shoppingList.customItems.filter(item => item.isChecked === showCheckedItems),
        [shoppingList.customItems, showCheckedItems]
    );

    const hasMultipleItems = useMemo(() => 
        shoppingList.customItems.length > 1,
        [shoppingList.customItems.length]
    );

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
                data={filteredItems}
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

            <View style={styles.buttonContainer}>
                <ShoppingListViewToggle 
                    showChecked={showCheckedItems}
                    onToggle={() => setShowCheckedItems(prev => !prev)}
                    visible={hasMultipleItems}
                />
            </View>


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
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 25,
        left: 25,
        zIndex: 1,
    }
});
