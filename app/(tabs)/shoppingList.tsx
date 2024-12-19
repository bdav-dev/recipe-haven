import { useContext, useState, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import Page from '@/components/Page';
import FloatingActionButton from '@/components/FloatingActionButton';
import SelectShoppingListItemTypeModal from '@/components/shoppingList/SelectShoppingListItemTypeModal';
import CreateCustomItemModal from '@/components/shoppingList/CreateCustomItemModal';
import { ShoppingListContext } from '@/context/ShoppingListContextProvider';
import CustomShoppingListItem from '@/components/shoppingList/CustomShoppingListItem';
import { ShoppingListCustomItem, ShoppingListIngredientItem } from '@/types/ShoppingListTypes';
import { updateCustomItem, deleteCheckedCustomItems, updateIngredientItem, deleteIngredientItem } from '@/data/dao/ShoppingListDao';
import ShoppingListViewToggle from '@/components/shoppingList/ShoppingListViewToggle';
import ShoppingListViewDeleteButton from '@/components/shoppingList/ShoppingListViewDeleteButton';
import EditCustomItemModal from '@/components/shoppingList/EditCustomItemModal';
import CreateIngredientItemModal from '@/components/shoppingList/CreateIngredientItemModal';
import IngredientShoppingListItem from '@/components/shoppingList/IngredientShoppingListItem';

type ModalType = 'none' | 'selection' | 'custom' | 'ingredient' | 'recipe';

export default function ShoppingListScreen() {
    const theme = useAppTheme();
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    const [showCheckedItems, setShowCheckedItems] = useState(false);
    const [activeModal, setActiveModal] = useState<ModalType>('none');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editItem, setEditItem] = useState<ShoppingListCustomItem>();

    const visibleItems = useMemo(() =>
        shoppingList.customItems.filter(item => item.isChecked === showCheckedItems),
        [shoppingList.customItems, showCheckedItems]
    );
    
    const visibleIngredientItems = useMemo(() =>
        shoppingList.ingredientItems.filter(item => item.isChecked === showCheckedItems),
        [shoppingList.ingredientItems, showCheckedItems]
    );

    const hasAnyItems = useMemo(() =>
        shoppingList.customItems.length > 0 || shoppingList.ingredientItems.length > 0,
        [shoppingList]
    );

    const hasCheckedItems = useMemo(() =>
        shoppingList.customItems.some(item => item.isChecked) ||
        shoppingList.ingredientItems.some(item => item.isChecked),
        [shoppingList]
    );

    const shouldShowToggle = useMemo(() =>
        hasCheckedItems || shoppingList.customItems.some(item => !item.isChecked),
        [hasCheckedItems, shoppingList.customItems]
    );

    const closeAllModals = () => setActiveModal('none');

    const launchEditItemModal = (item: ShoppingListCustomItem) => {
        setEditItem(item);
        setIsEditModalVisible(true);
    }

    const replaceActiveModal = (newValue: ModalType) => { // absolute bullshit, but needs to be there to work on iOS
        setActiveModal("none");
        setTimeout(
            () => setActiveModal(newValue),
            500
        );
    };

    const updateItemCheckStatus = async (item: ShoppingListCustomItem) => {
        const updatedItem = {
            ...item,
            isChecked: !item.isChecked
        };

        try {
            await updateCustomItem({
                originalItem: item,
                updatedValues: updatedItem
            });

            setShoppingList(current => ({
                ...current,
                customItems: current.customItems.map(existingItem =>
                    existingItem.shoppingListCustomItemId === item.shoppingListCustomItemId
                        ? updatedItem
                        : existingItem
                )
            }));
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const updateIngredientCheckStatus = async (item: ShoppingListIngredientItem) => {
        try {
            const updatedItem = {
                ...item,
                isChecked: !item.isChecked
            };

            await updateIngredientItem({
                originalItem: item,
                updatedValues: updatedItem
            });

            // Fix: Update state while preserving all items
            setShoppingList(current => ({
                ...current,
                ingredientItems: current.ingredientItems.map(existingItem =>
                    existingItem.shoppingListIngredientItemId === item.shoppingListIngredientItemId
                        ? updatedItem
                        : existingItem
                )
            }));
        } catch (error) {
            console.error('Failed to update ingredient item:', error);
        }
    };

    const handleDeleteCheckedItems = async () => {
        try {
            await deleteCheckedCustomItems();
            setShoppingList(current => ({
                ...current,
                customItems: current.customItems.filter(item => !item.isChecked)
            }));
            // Automatically switch back to unchecked view when all checked items are deleted
            setShowCheckedItems(false);
        } catch (error) {
            console.error('Failed to delete checked items:', error);
        }
    };

    return (
        <Page>
            <View style={styles.listContainer}>
                <FlatList
                    data={visibleItems}
                    style={styles.list}
                    ListHeaderComponent={() => (
                        <FlatList
                            data={visibleIngredientItems}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                            renderItem={({ item }) => (
                                <IngredientShoppingListItem
                                    key={`ingredient-${item.shoppingListIngredientItemId}`}
                                    item={item}
                                    onToggleCheck={updateIngredientCheckStatus}
                                />
                            )}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    renderItem={({ item }) => (
                        <CustomShoppingListItem
                            key={`custom-${item.shoppingListCustomItemId}`}
                            item={item}
                            onToggleCheck={updateItemCheckStatus}
                            editButton={{ onPress: () => launchEditItemModal(item) }}
                        />
                    )}
                />
            </View>
    
            <View style={styles.buttonContainer}>
                <ShoppingListViewToggle
                    showChecked={showCheckedItems}
                    onToggle={() => setShowCheckedItems(prev => !prev)}
                    visible={shouldShowToggle}
                />
            </View>

            {showCheckedItems ? (
                <View style={styles.deleteButtonContainer}>
                    <ShoppingListViewDeleteButton
                        onDelete={handleDeleteCheckedItems}
                        visible={hasCheckedItems}
                    />
                </View>
            ) : (
                <FloatingActionButton onPress={() => setActiveModal('selection')}>
                    <Ionicons name='add-outline' color={theme.card} size={35} />
                </FloatingActionButton>
            )}

            {
                activeModal == 'selection' && // absolute bullshit, but needs to be there to work on iOS
                <SelectShoppingListItemTypeModal
                    isVisible={activeModal == 'selection'}
                    onRequestClose={closeAllModals}
                    onSelectCustomItem={() => replaceActiveModal('custom')}
                    onSelectIngredient={() => replaceActiveModal('ingredient')}
                    onSelectRecipe={() => replaceActiveModal('recipe')}
                />
            }

            {
                activeModal == 'custom' && // absolute bullshit, but needs to be there to work on iOS
                <CreateCustomItemModal
                    isVisible={activeModal == 'custom'}
                    onRequestClose={closeAllModals}
                />
            }
            {
                activeModal == 'ingredient' && // absolute bullshit, but needs to be there to work on iOS
                <CreateIngredientItemModal
                    isVisible={activeModal == 'ingredient'}
                    onRequestClose={closeAllModals}
                />
            }
            {/* Edit custom item modal */}
            <EditCustomItemModal
                isVisible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
                editItem={editItem}
            />

            {/* Add future modals here:
            <SelectIngredientModal 
                isVisible={activeModal === 'ingredient'}
                onRequestClose={closeModals}
            />
            <SelectRecipeModal 
                isVisible={activeModal === 'recipe'}
                onRequestClose={closeModals}
            />
            */}
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
    },
    deleteButtonContainer: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        zIndex: 1,
    },
    listContainer: {
        flex: 1,
        width: '100%'
    }
});
