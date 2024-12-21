import { useContext, useState, useMemo, useEffect } from 'react';
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
import EditIngredientItemModal from '@/components/shoppingList/EditIngredientItemModal';
import SearchBar from '@/components/SearchBar';
import NoItemsInfo from '@/components/NoItemsInfo';
import NoSearchResultsBadge from '@/components/NoSearchResultsBadge';
import { includesIgnoreCase } from '@/utils/StringUtils';

const INSERT_NEW_ITEMS_AT_TOP = false; // Set to false to add new items at the bottom

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
    const [editIngredientItem, setEditIngredientItem] = useState<ShoppingListIngredientItem>();
    const [isEditIngredientModalVisible, setIsEditIngredientModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

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
            // Reverse the sort order based on the flag
            return INSERT_NEW_ITEMS_AT_TOP 
                ? dateB.getTime() - dateA.getTime()  // Newer items at top
                : dateA.getTime() - dateB.getTime(); // Newer items at bottom
        });
    }, [shoppingList.customItems, shoppingList.ingredientItems, showCheckedItems]);

    const filteredVisibleItems = useMemo(() => {
        const items = combinedVisibleItems;
        if (!searchText.trim()) return items;

        return items.filter(item => {
            if (item.type === 'custom') {
                return includesIgnoreCase(item.data.text, searchText);
            } else {
                const ingredient = item.data.ingredient.ingredient;
                return includesIgnoreCase(ingredient.name, searchText) ||
                    (ingredient.pluralName && includesIgnoreCase(ingredient.pluralName, searchText));
            }
        });
    }, [combinedVisibleItems, searchText]);

    // Helper function to merge checked ingredient items
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

    const hasUncheckedItems = useMemo(() =>
        shoppingList.customItems.some(item => !item.isChecked) ||
        shoppingList.ingredientItems.some(item => !item.isChecked),
        [shoppingList]
    );

    // This ensures the toggle is visible as long as there are ANY items
    const shouldShowToggle = useMemo(() =>
        hasCheckedItems || hasUncheckedItems,
        [hasCheckedItems, hasUncheckedItems]
    );

    // If we're showing checked items but there are none left, switch to unchecked view
    useEffect(() => {
        if (showCheckedItems && !hasCheckedItems) {
            setShowCheckedItems(false);
        }
    }, [hasCheckedItems, showCheckedItems]);

    const closeAllModals = () => setActiveModal('none');

    const launchEditItemModal = (item: ShoppingListCustomItem) => {
        setEditItem(item);
        setIsEditModalVisible(true);
    }

    const launchEditIngredientModal = (item: ShoppingListIngredientItem) => {
        setEditIngredientItem(item);
        setIsEditIngredientModalVisible(true);
    };

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
            // If this is an aggregated item being unchecked
            if (item.isAggregated && item.isChecked) {
                // Find all related checked items
                const relatedItems = shoppingList.ingredientItems.filter(i => 
                    i.isChecked && 
                    i.ingredient.ingredient.ingredientId === item.ingredient.ingredient.ingredientId
                );

                // Calculate original quantities by timestamps
                const timestamps = new Set(relatedItems.map(i => i.creationTimestamp.getTime()));
                const separateItems = Array.from(timestamps).map(timestamp => {
                    const items = relatedItems.filter(i => i.creationTimestamp.getTime() === timestamp);
                    return {
                        ...items[0],
                        ingredient: {
                            ...items[0].ingredient,
                            amount: items.reduce((sum, i) => sum + i.ingredient.amount, 0)
                        },
                        isChecked: false,
                        isAggregated: false
                    };
                });

                // Update all items
                await Promise.all(
                    separateItems.map(item => 
                        updateIngredientItem({
                            originalItem: item,
                            updatedValues: item
                        })
                    )
                );

                setShoppingList(current => ({
                    ...current,
                    ingredientItems: current.ingredientItems
                        .filter(i => !relatedItems.some(ri => ri.shoppingListIngredientItemId === i.shoppingListIngredientItemId))
                        .concat(separateItems)
                }));
                return;
            }

            // Normal single item toggle
            const updatedItem = {
                ...item,
                isChecked: !item.isChecked,
                isAggregated: false
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
            {hasAnyItems && (
                <SearchBar 
                    searchText={searchText} 
                    onSearchTextChange={setSearchText}
                />
            )}

            {!hasAnyItems ? (
                <NoItemsInfo type="shoppingList" />
            ) : (
                <FlatList
                    data={filteredVisibleItems}
                    style={styles.list}
                    contentContainerStyle={[
                        styles.listContainer,
                        filteredVisibleItems.length === 0 && styles.emptyList
                    ]}
                    ListEmptyComponent={() => 
                        searchText.trim() ? <NoSearchResultsBadge /> : null
                    }
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
                                editButton={{ onPress: () => launchEditIngredientModal(item.data) }}
                            />
                        )
                    }
                    keyExtractor={item => 
                        item.type === 'custom' 
                            ? `custom-${item.data.shoppingListCustomItemId}` 
                            : `ingredient-${item.data.shoppingListIngredientItemId}`
                    }
                />
            )}

            {shouldShowToggle && (
                <View style={styles.buttonContainer}>
                    <ShoppingListViewToggle
                        showChecked={showCheckedItems}
                        onToggle={() => setShowCheckedItems(prev => !prev)}
                        visible={true}
                    />
                </View>
            )}

            {showCheckedItems ? (
                hasCheckedItems && (
                    <View style={styles.deleteButtonContainer}>
                        <ShoppingListViewDeleteButton
                            onDelete={handleDeleteCheckedItems}
                            visible={true}
                        />
                    </View>
                )
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

            {/* Edit ingredient item modal */}
            <EditIngredientItemModal
                isVisible={isEditIngredientModalVisible}
                onRequestClose={() => setIsEditIngredientModalVisible(false)}
                editItem={editIngredientItem}
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
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
