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
import { ShoppingListCustomItem, ShoppingListIngredientItem, ShoppingList } from '@/types/ShoppingListTypes';
import { updateCustomItem, deleteCheckedItems, updateIngredientItem, deleteIngredientItem } from '@/data/dao/ShoppingListDao';
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

    const visibleItems = useMemo(() => {
        const items = filterAndSortItems(shoppingList, showCheckedItems);
        return searchText.trim() ? filterBySearch(items, searchText) : items;
    }, [shoppingList, showCheckedItems, searchText]);

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
                deleteCheckedItems(), // Changed from deleteCheckedCustomItems
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

    const handleEditItem = (item: ShoppingListCustomItem | ShoppingListIngredientItem) => {
        if ('text' in item) {
            setEditItem(item);
            setIsEditModalVisible(true);
        } else {
            setEditIngredientItem(item);
            setIsEditIngredientModalVisible(true);
        }
    };

    const renderItem = ({ item }: { item: ShoppingListItem }) => {
        if (item.type === 'custom') {
            return (
                <CustomShoppingListItem
                    item={item.data}
                    onToggleCheck={updateItemCheckStatus}
                    editButton={{ onPress: () => handleEditItem(item.data) }}
                />
            );
        }
        
        return (
            <IngredientShoppingListItem
                item={item.data}
                onToggleCheck={updateIngredientCheckStatus}
                editButton={{ onPress: () => handleEditItem(item.data) }}
            />
        );
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
                    data={visibleItems}
                    style={styles.list}
                    contentContainerStyle={[
                        styles.listContainer,
                        visibleItems.length === 0 && styles.emptyList
                    ]}
                    ListEmptyComponent={() => 
                        searchText.trim() ? <NoSearchResultsBadge /> : null
                    }
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    renderItem={renderItem}
                    keyExtractor={item => 
                        `${item.type}-${item.type === 'custom' 
                            ? item.data.shoppingListCustomItemId 
                            : item.data.shoppingListIngredientItemId}`
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

// Helper functions
function filterAndSortItems(shoppingList: ShoppingList, showChecked: boolean): ShoppingListItem[] {
    const customItems: Array<ShoppingListItem> = shoppingList.customItems
        .filter((item: ShoppingListCustomItem) => item.isChecked === showChecked)
        .map((item: ShoppingListCustomItem) => ({ type: 'custom' as const, data: item }));
        
    const ingredientItems: Array<{ type: 'ingredient', data: ShoppingListIngredientItem }> = shoppingList.ingredientItems
        .filter((item: ShoppingListIngredientItem) => item.isChecked === showChecked)
        .map((item: ShoppingListIngredientItem) => ({ type: 'ingredient' as const, data: item }));

    const processedIngredientItems = showChecked 
        ? mergeCheckedIngredients(ingredientItems)
        : ingredientItems;

    return sortByTimestamp([...customItems, ...processedIngredientItems]);
}

function filterBySearch(items: ShoppingListItem[], searchText: string): ShoppingListItem[] {
    const trimmed = searchText.trim();
    return items.filter(item => {
        if (item.type === 'custom') {
            return includesIgnoreCase(item.data.text, trimmed);
        }
        const ingredient = item.data.ingredient.ingredient;
        return includesIgnoreCase(ingredient.name, trimmed) ||
            (ingredient.pluralName && includesIgnoreCase(ingredient.pluralName, trimmed));
    });
}

function sortByTimestamp(items: ShoppingListItem[]): ShoppingListItem[] {
    return items.sort((a, b) => 
        INSERT_NEW_ITEMS_AT_TOP
            ? b.data.creationTimestamp.getTime() - a.data.creationTimestamp.getTime()
            : a.data.creationTimestamp.getTime() - b.data.creationTimestamp.getTime()
    );
}

// Helper function to merge checked ingredient items
function mergeCheckedIngredients(items: Array<{ type: 'ingredient', data: ShoppingListIngredientItem }>): Array<{ type: 'ingredient', data: ShoppingListIngredientItem }> {
    return items.reduce((acc, curr) => {
        const existingItemIndex = acc.findIndex(item => 
            item.data.ingredient.ingredient.ingredientId === curr.data.ingredient.ingredient.ingredientId
        );

        if (existingItemIndex >= 0) {
            const updatedItem = { ...acc[existingItemIndex] };
            updatedItem.data = {
                ...updatedItem.data,
                ingredient: {
                    ...updatedItem.data.ingredient,
                    amount: updatedItem.data.ingredient.amount + curr.data.ingredient.amount
                },
                isAggregated: true
            };
            acc[existingItemIndex] = updatedItem;
            return acc;
        }

        return [...acc, curr];
    }, [] as Array<{ type: 'ingredient', data: ShoppingListIngredientItem }>);
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
