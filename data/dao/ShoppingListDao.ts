import { ShoppingList, ShoppingListCustomItem, ShoppingListIngredientItem } from "@/types/ShoppingListTypes";
import database from "../database/Database";
import { DatabaseIngredient, DatabaseShoppingListCustomItem, DatabaseShoppingListIngredientItem } from "@/types/DatabaseTypes";
import { CreateShoppingListCustomItemBlueprint, CreateShoppingListIngredientItemBlueprint, UpdateShoppingListCustomItemBlueprint, UpdateShoppingListIngredientItemBlueprint } from "@/types/dao/ShoppingListDaoTypes";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import { mapFromDatabaseModel as mapIngredientFromDatabaseModel } from './IngredientDao';

export function createShoppingListTableIfNotExists() {
    database.execSync(`
        CREATE TABLE IF NOT EXISTS ShoppingListCustomItem(
            shoppingListCustomItemId INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            isChecked INTEGER NOT NULL DEFAULT 0,
            creationTimestamp TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ShoppingListIngredientItem(
            shoppingListIngredientItemId INTEGER PRIMARY KEY AUTOINCREMENT,
            ingredientId INTEGER NOT NULL,
            quantity REAL NOT NULL,
            isChecked INTEGER NOT NULL DEFAULT 0,
            creationTimestamp TEXT NOT NULL,
            FOREIGN KEY(ingredientId) REFERENCES Ingredient(ingredientId)
        );
    `);
}

// Database operations for custom items
const CustomItemsDB = {
    insert: async (item: Omit<ShoppingListCustomItem, 'shoppingListCustomItemId'>): Promise<ShoppingListCustomItem> => {
        const dbItem = prepareCustomItemForDatabase(item);
        const result = await database.runAsync(
            'INSERT INTO ShoppingListCustomItem (text, isChecked, creationTimestamp) VALUES (?, ?, ?);',
            [dbItem.text, dbItem.isChecked, dbItem.timestamp]
        );
        return { shoppingListCustomItemId: result.lastInsertRowId, ...item };
    },

    update: async (item: ShoppingListCustomItem) => {
        await database.runAsync(
            `UPDATE ShoppingListCustomItem
             SET text = ?, isChecked = ?, creationTimestamp = ?
             WHERE shoppingListCustomItemId = ?`,
            [item.text, item.isChecked ? 1 : 0, item.creationTimestamp.toISOString(), item.shoppingListCustomItemId]
        );
    },

    delete: async (itemId: number) => {
        await database.runAsync(
            'DELETE FROM ShoppingListCustomItem WHERE shoppingListCustomItemId = ?',
            itemId
        );
    },

    deleteChecked: async () => {
        await database.runAsync('DELETE FROM ShoppingListCustomItem WHERE isChecked = 1;');
    }
};

// Database operations for ingredient items
const IngredientItemsDB = {
    insert: async (item: Omit<ShoppingListIngredientItem, 'shoppingListIngredientItemId'>): Promise<ShoppingListIngredientItem> => {
        const dbItem = prepareIngredientItemForDatabase(item);
        const insertResult = await database.runAsync(
            `INSERT INTO ShoppingListIngredientItem (ingredientId, quantity, isChecked, creationTimestamp)
             VALUES (?, ?, ?, ?);`,
            [dbItem.ingredientId, dbItem.quantity, dbItem.isChecked, dbItem.timestamp]
        );

        return {
            shoppingListIngredientItemId: insertResult.lastInsertRowId,
            ...item
        };
    },

    update: async (item: ShoppingListIngredientItem) => {
        await database.runAsync(
            `
            UPDATE ShoppingListIngredientItem
            SET ingredientId = ?,
                quantity = ?,
                isChecked = ?,
                creationTimestamp = ?
            WHERE shoppingListIngredientItemId = ?
            `,
            [
                item.ingredient.ingredient.ingredientId,
                item.ingredient.amount,
                item.isChecked ? 1 : 0,
                item.creationTimestamp.toISOString(),
                item.shoppingListIngredientItemId
            ]
        );
    },

    delete: async (itemId: number) => {
        await database.runAsync(
            `
            DELETE FROM ShoppingListIngredientItem
            WHERE shoppingListIngredientItemId = ?
            `,
            itemId
        );
    },

    deleteChecked: async () => {
        await database.runAsync(
            `DELETE FROM ShoppingListIngredientItem
             WHERE isChecked = 1;`
        );
    }
};

// Create Operations
export async function createCustomItem(blueprint: CreateShoppingListCustomItemBlueprint) {
    return await CustomItemsDB.insert({
        text: blueprint.text,
        isChecked: false,
        creationTimestamp: new Date()
    });
}

export async function createIngredientItem(blueprint: CreateShoppingListIngredientItemBlueprint) {
    return await IngredientItemsDB.insert({
        ingredient: blueprint.ingredient,
        isChecked: false,
        creationTimestamp: new Date()
    });
}

// Read Operations
export async function getAllCustomItems() {
    return await getAllCustomItemsFromDatabase();
}

export async function getAllIngredientItems() {
    return await getAllIngredientItemsFromDatabase();
}

export async function getAllShoppingListItems(): Promise<ShoppingList> {
    try {
        const [customItems, ingredientItems] = await Promise.all([
            getAllCustomItemsFromDatabase(),
            getAllIngredientItemsFromDatabase()
        ]);
        return {
            customItems,
            ingredientItems
        };
    } catch (error) {
        console.error('Failed to load shopping list items:', error);
        return { customItems: [], ingredientItems: [] };
    }
}

// Update Operations
export async function updateCustomItem(blueprint: UpdateShoppingListCustomItemBlueprint) {
    const updatedItem: ShoppingListCustomItem = {
        shoppingListCustomItemId: blueprint.originalItem.shoppingListCustomItemId,
        ...blueprint.updatedValues
    };

    await CustomItemsDB.update(updatedItem);
    return updatedItem;
}

export async function updateIngredientItem(blueprint: UpdateShoppingListIngredientItemBlueprint) {
    const updatedItem: ShoppingListIngredientItem = {
        shoppingListIngredientItemId: blueprint.originalItem.shoppingListIngredientItemId,
        ...blueprint.updatedValues
    };
    await IngredientItemsDB.update(updatedItem);
    return updatedItem;
}

// Delete Operations
export async function deleteCustomItem(item: ShoppingListCustomItem) {
    await CustomItemsDB.delete(item.shoppingListCustomItemId);
}

export async function deleteIngredientItem(item: ShoppingListIngredientItem) {
    await IngredientItemsDB.delete(item.shoppingListIngredientItemId);
}

export async function deleteCheckedItems(){
    await Promise.all([
        CustomItemsDB.deleteChecked(),
        IngredientItemsDB.deleteChecked()
    ]);
}

// Database Operations
async function getAllCustomItemsFromDatabase(): Promise<ShoppingListCustomItem[]> {
    const result = await database.getAllAsync<DatabaseShoppingListCustomItem>(
        'SELECT * FROM ShoppingListCustomItem;'
    );
    return result.map(mapCustomItemFromDatabaseModel);
}

async function getAllIngredientItemsFromDatabase(): Promise<ShoppingListIngredientItem[]> {
    const result = await database.getAllAsync<DatabaseShoppingListIngredientItem & DatabaseIngredient>(`
        SELECT sli.shoppingListIngredientItemId, 
               sli.quantity as amount, 
               sli.isChecked,
               sli.creationTimestamp,
               i.ingredientId,
               i.name, 
               i.pluralName, 
               i.unit, 
               i.imageSrc,
               i.calorificValueKcal, 
               i.calorificValueNUnits
        FROM ShoppingListIngredientItem sli
        JOIN Ingredient i ON sli.ingredientId = i.ingredientId;
    `);
    return result.map(mapIngredientItemFromDatabaseModel);
}

function prepareCustomItemForDatabase(item: Omit<ShoppingListCustomItem, 'shoppingListCustomItemId'>) {
    return {
        text: item.text,
        isChecked: item.isChecked ? 1 : 0,
        timestamp: item.creationTimestamp.toISOString()
    };
}

function prepareIngredientItemForDatabase(item: Omit<ShoppingListIngredientItem, 'shoppingListIngredientItemId'>) {
    return {
        ingredientId: item.ingredient.ingredient.ingredientId,
        quantity: item.ingredient.amount,
        isChecked: item.isChecked ? 1 : 0,
        timestamp: item.creationTimestamp.toISOString()
    };
}

function mapCustomItemFromDatabaseModel(dbItem: DatabaseShoppingListCustomItem): ShoppingListCustomItem {
    return {
        shoppingListCustomItemId: dbItem.shoppingListCustomItemId,
        text: dbItem.text,
        isChecked: Boolean(dbItem.isChecked),
        creationTimestamp: new Date(dbItem.creationTimestamp)
    };
}

function mapIngredientItemFromDatabaseModel(dbItem: DatabaseShoppingListIngredientItem & DatabaseIngredient): ShoppingListIngredientItem {
    const baseIngredient = mapIngredientFromDatabaseModel(dbItem);

    const quantizedIngredient: QuantizedIngredient = {
        amount: dbItem.amount || 0,
        ingredient: baseIngredient
    };

    return {
        shoppingListIngredientItemId: dbItem.shoppingListIngredientItemId,
        ingredient: quantizedIngredient,
        isChecked: Boolean(dbItem.isChecked),
        creationTimestamp: new Date(dbItem.creationTimestamp)
    };
}
