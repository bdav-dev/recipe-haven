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

type ShoppingListItem = 
    | { type: 'custom'; data: ShoppingListCustomItem }
    | { type: 'ingredient'; data: ShoppingListIngredientItem };

type ModalType = 'none' | 'selection' | 'custom' | 'ingredient' | 'recipe';

export default function ShoppingListScreen() {
    const theme = useAppTheme();
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    const [showCheckedItems, setShowCheckedItems] = useState(false);
    const [activeModal, setActiveModal] = useState<ModalType>('none');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editItem, setEditItem] = useState<ShoppingListCustomItem>();

    const combinedVisibleItems = useMemo(() => {
        const customItems = shoppingList.customItems
            .filter(item => item.isChecked === showCheckedItems)
            .map(item => ({ type: 'custom' as const, data: item }));
            
        const ingredientItems = shoppingList.ingredientItems
            .filter(item => item.isChecked === showCheckedItems)
            .map(item => ({ type: 'ingredient' as const, data: item }));

        // Group and merge checked ingredient items if needed
        const processedIngredientItems = showCheckedItems 
            ? mergeCheckedIngredients(ingredientItems)
            : ingredientItems;

        return [...customItems, ...processedIngredientItems].sort((a, b) => {
            const dateA = a.data.creationTimestamp;
            const dateB = b.data.creationTimestamp;
            return dateB.getTime() - dateA.getTime();
        });
    }, [shoppingList.customItems, shoppingList.ingredientItems, showCheckedItems]);

    // Add this helper function above
    function mergeCheckedIngredients(items: Array<{ type: 'ingredient', data: ShoppingListIngredientItem }>) {
        return items.reduce((acc, curr) => {
            const existingItemIndex = acc.findIndex(item => 
                item.data.ingredient.ingredient.ingredientId === curr.data.ingredient.ingredient.ingredientId
            );

            if (existingItemIndex >= 0) {
                acc[existingItemIndex].data.ingredient.amount += curr.data.ingredient.amount;
                acc[existingItemIndex].data.isAggregated = true;
                return acc;
            }

            return [...acc, curr];
        }, [] as typeof items);
    }

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
            // If this is an aggregated item being unchecked, we need to uncheck all related items
            if (item.isAggregated && item.isChecked) {
                const relatedItems = shoppingList.ingredientItems.filter(i => 
                    i.isChecked && 
                    i.ingredient.ingredient.ingredientId === item.ingredient.ingredient.ingredientId
                );

                await Promise.all(
                    relatedItems.map(relatedItem => 
                        updateIngredientItem({
                            originalItem: relatedItem,
                            updatedValues: { ...relatedItem, isChecked: false }
                        })
                    )
                );

                setShoppingList(current => ({
                    ...current,
                    ingredientItems: current.ingredientItems.map(existingItem => 
                        relatedItems.some(ri => ri.shoppingListIngredientItemId === existingItem.shoppingListIngredientItemId)
                            ? { ...existingItem, isChecked: false }
                            : existingItem
                    )
                }));
                return;
            }

            // Normal single item toggle
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
            // Delete both custom and ingredient items
            await Promise.all([
                deleteCheckedCustomItems(),
                ...shoppingList.ingredientItems
                    .filter(item => item.isChecked)
                    .map(item => deleteIngredientItem(item))
            ]);

            setShoppingList(current => ({
                ...current,
                customItems: current.customItems.filter(item => !item.isChecked),
                ingredientItems: current.ingredientItems.filter(item => !item.isChecked)
            }));
            setShowCheckedItems(false);
        } catch (error) {
            console.error('Failed to delete checked items:', error);
        }
    };

    return (
        <Page>
            <FlatList
                data={combinedVisibleItems}
                style={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => 
                    item.type === 'custom' ? (
                        <CustomShoppingListItem
                            key={`custom-${item.data.shoppingListCustomItemId}`}
                            item={item.data}
                            onToggleCheck={updateItemCheckStatus}
                            editButton={{ onPress: () => launchEditItemModal(item.data) }}
                        />
                    ) : (
                        <IngredientShoppingListItem
                            key={`ingredient-${item.data.shoppingListIngredientItemId}`}
                            item={item.data}
                            onToggleCheck={updateIngredientCheckStatus}
                        />
                    )
                }
                keyExtractor={item => 
                    item.type === 'custom' 
                        ? `custom-${item.data.shoppingListCustomItemId}` 
                        : `ingredient-${item.data.shoppingListIngredientItemId}`
                }
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
        bottom: 25,
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
