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
import { updateCustomItem, deleteCheckedItems, updateIngredientItem, deleteIngredientItem, createIngredientItem } from '@/data/dao/ShoppingListDao';
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

    // If showing checked items but there are none left, switch to unchecked view
    useEffect(() => {
        if (showCheckedItems && !hasCheckedItems) {
            setShowCheckedItems(false);
        }
    }, [hasCheckedItems, showCheckedItems]);

    const closeAllModals = () => setActiveModal('none');

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
            console.log('Failed to update item:', error);
        }
    };

    // Update the check status of an ingredient itemS
    const updateIngredientCheckStatus = async (item: ShoppingListIngredientItem) => {
        try {
            // When checking an aggregated item, create a new entry with the total amount
            if (item.isAggregated && !item.isChecked) {
                const newItem = {
                    ...item,
                    isChecked: true,
                    isAggregated: false,
                    shoppingListIngredientItemId: undefined,
                    creationTimestamp: new Date()
                };

                // Create a new entry in the database
                const createdItem = await createIngredientItem({
                    ingredient: newItem.ingredient
                });

                // Remove all unchecked items of this ingredient type and add the new checked item
                setShoppingList(current => ({
                    ...current,
                    ingredientItems: [
                        ...current.ingredientItems.filter(i =>
                            i.ingredient.ingredient.ingredientId !== item.ingredient.ingredient.ingredientId ||
                            i.isChecked
                        ),
                        createdItem
                    ]
                }));

                // Delete the old unchecked items from the database
                const itemsToDelete = shoppingList.ingredientItems.filter(i =>
                    i.ingredient.ingredient.ingredientId === item.ingredient.ingredient.ingredientId &&
                    !i.isChecked
                );
                await Promise.all(itemsToDelete.map(i => deleteIngredientItem(i)));

                return;
            }

            // Update the check status of the item
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
            console.log('Failed to update ingredient item:', error);
        }
    };

    const handleDeleteCheckedItems = async () => {
        try {
            // Delete both custom and ingredient items
            await Promise.all([
                deleteCheckedItems(),
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
            console.log('Failed to delete checked items:', error);
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

            {
                hasCheckedItems &&
                <ShoppingListViewToggle
                    showChecked={showCheckedItems}
                    onToggle={() => setShowCheckedItems(prev => !prev)}
                />
            }

            {showCheckedItems ? (
                hasCheckedItems && (
                    <ShoppingListViewDeleteButton
                        onDelete={handleDeleteCheckedItems}
                    />
                )
            ) : (
                <FloatingActionButton onPress={() => setActiveModal('selection')} position='right'>
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

    // Merge unchecked ingredients
    const processedIngredientItems = showChecked
        ? ingredientItems
        : mergeIngredients(ingredientItems);

    return sortByTimestamp([...customItems, ...processedIngredientItems]);
}

// Helper function to merge ingredients with the same ID
function mergeIngredients(items: Array<{ type: 'ingredient', data: ShoppingListIngredientItem }>): Array<{ type: 'ingredient', data: ShoppingListIngredientItem }> {
    const mergedMap = new Map<number, { type: 'ingredient', data: ShoppingListIngredientItem }>();

    items.forEach(item => {
        const ingredientId = item.data.ingredient.ingredient.ingredientId;

        if (mergedMap.has(ingredientId)) {
            const existing = mergedMap.get(ingredientId)!;
            const updatedItem = {
                type: 'ingredient' as const,
                data: {
                    ...existing.data,
                    ingredient: {
                        ...existing.data.ingredient,
                        amount: existing.data.ingredient.amount + item.data.ingredient.amount
                    },
                    isAggregated: true
                }
            };
            mergedMap.set(ingredientId, updatedItem);
        } else {
            mergedMap.set(ingredientId, {
                type: 'ingredient',
                data: { ...item.data, isAggregated: false }
            });
        }
    });

    return Array.from(mergedMap.values());
}

// Helper function to filter items by search text
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

// Helper function to sort items by timestamp
function sortByTimestamp(items: ShoppingListItem[]): ShoppingListItem[] {
    return items.sort((a, b) =>
        INSERT_NEW_ITEMS_AT_TOP
            ? b.data.creationTimestamp.getTime() - a.data.creationTimestamp.getTime()
            : a.data.creationTimestamp.getTime() - b.data.creationTimestamp.getTime()
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 8
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        zIndex: 1,
    },
    deleteButtonContainer: {
        position: 'absolute',
        bottom: 25,
        right: 20,
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
