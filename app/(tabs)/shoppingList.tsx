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
import { updateCustomItem, deleteCheckedCustomItems } from '@/data/dao/ShoppingListDao';
import ShoppingListViewToggle from '@/components/shoppingList/ShoppingListViewToggle';
import ShoppingListViewDeleteButton from '@/components/shoppingList/ShoppingListViewDeleteButton';
import EditCustomItemModal from '@/components/shoppingList/EditCustomItemModal';
import SelectShoppingListIngredientEntries from '@/components/shoppingList/SelectShoppingListIngredientEntries';
import CreateIngredientItemModal from '@/components/shoppingList/CreateIngredientItemModal';
import { Ingredient } from '@/types/IngredientTypes';
import IngredientShoppingListItem from '@/components/shoppingList/IngredientShoppingListItem';
import { updateIngredientItem } from '@/data/dao/ShoppingListDao';

type ModalType = 'none' | 'selection' | 'custom' | 'ingredient' | 'recipe' | 'ingredient-create';

export default function ShoppingListScreen() {
    const theme = useAppTheme();
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    const [showCheckedItems, setShowCheckedItems] = useState(false);
    const [activeModal, setActiveModal] = useState<ModalType>('none');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editItem, setEditItem] = useState<ShoppingListCustomItem>();
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();

    const visibleItems = useMemo(() => {
        const customItems = shoppingList.customItems.filter(item => item.isChecked === showCheckedItems);
        let ingredientItems = shoppingList.ingredientItems.filter(item => item.isChecked === showCheckedItems);

        // Combine same ingredients when checked
        if (showCheckedItems) {
            const combinedIngredients = new Map();
            ingredientItems.forEach(item => {
                const key = item.ingredient.ingredient.ingredientId;
                if (combinedIngredients.has(key)) {
                    const existing = combinedIngredients.get(key);
                    existing.ingredient.amount += item.ingredient.amount;
                } else {
                    combinedIngredients.set(key, { ...item, isAggregated: true });
                }
            });
            ingredientItems = Array.from(combinedIngredients.values());
        }

        return [...customItems, ...ingredientItems].sort((a, b) => 
            b.creationTimestamp.getTime() - a.creationTimestamp.getTime()
        );
    }, [shoppingList.customItems, shoppingList.ingredientItems, showCheckedItems]);

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

    const handleIngredientSelected = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        replaceActiveModal('ingredient-create');
    };

    return (
        <Page>
            <FlatList
                data={visibleItems}
                style={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={listItemInfo => {
                    const item = listItemInfo.item;
                    
                    if ('text' in item) {
                        return (
                            <CustomShoppingListItem
                                key={listItemInfo.index}
                                item={item}
                                onToggleCheck={updateItemCheckStatus}
                                editButton={{ onPress: () => launchEditItemModal(item) }}
                            />
                        );
                    } else {
                        const ingredientItem = item as ShoppingListIngredientItem;
                        return (
                            <IngredientShoppingListItem
                                key={listItemInfo.index}
                                item={ingredientItem}
                                onToggleCheck={updateIngredientCheckStatus}
                                editButton={{ onPress: () => {/* TODO: Implement edit */} }}
                                isAggregated={ingredientItem.isAggregated}
                            />
                        );
                    }
                }}
            />

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
            {/* Edit custom item modal */}
            <EditCustomItemModal
                isVisible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
                editItem={editItem}
            />

            {activeModal === 'ingredient' && // absolute bullshit, but needs to be there to work on iOS
                <SelectShoppingListIngredientEntries
                    isVisible={activeModal === 'ingredient'}
                    onRequestClose={closeAllModals}
                    onIngredientSelected={handleIngredientSelected}
                />
            }

            { activeModal === 'ingredient-create' && // absolute bullshit, but needs to be there to work on iOS
                <CreateIngredientItemModal
                    isVisible={activeModal === 'ingredient-create'}
                    onRequestClose={closeAllModals}
                    selectedIngredient={selectedIngredient}
                />
            }
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
    }
});
