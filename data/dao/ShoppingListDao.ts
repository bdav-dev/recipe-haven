import { ShoppingListCustomItem } from "@/types/ShoppingListTypes";
import database from "../database/Database";
import { DatabaseShoppingListCustomItem } from "@/types/DatabaseTypes";
import { CreateShoppingListCustomItemBlueprint, UpdateShoppingListCustomItemBlueprint } from "@/types/dao/ShoppingListDaoTypes";

export function createShoppingListTableIfNotExists() {
    database.execSync(`
        CREATE TABLE IF NOT EXISTS ShoppingListCustomItem(
            shoppingListCustomItemId INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            isChecked INTEGER NOT NULL DEFAULT 0,
            creationTimestamp TEXT NOT NULL
        );
    `);
}

export async function createCustomItem(blueprint: CreateShoppingListCustomItemBlueprint) {
    return await insertCustomItemInDatabase({
        text: blueprint.text,
        isChecked: false,
        creationTimestamp: new Date()
    });
}

export async function getAllCustomItems() {
    return await getAllCustomItemsFromDatabase();
}

export async function updateCustomItem(blueprint: UpdateShoppingListCustomItemBlueprint) {
    const updatedItem: ShoppingListCustomItem = {
        shoppingListCustomItemId: blueprint.originalItem.shoppingListCustomItemId,
        text: blueprint.updatedValues.text,
        isChecked: blueprint.updatedValues.isChecked,
        creationTimestamp: blueprint.updatedValues.creationTimestamp
    }

    await updateCustomItemInDatabase(updatedItem);
    return updatedItem;
}

export async function deleteCustomItem(item: ShoppingListCustomItem) {
    await deleteCustomItemInDatabase(item.shoppingListCustomItemId);
}

async function insertCustomItemInDatabase(item: Omit<ShoppingListCustomItem, 'shoppingListCustomItemId'>): Promise<ShoppingListCustomItem> {
    const insertResult = await database.runAsync(
        `
        INSERT INTO
            ShoppingListCustomItem (text, isChecked, creationTimestamp)
            VALUES (?, ?, ?);
        `,
        item.text,
        item.isChecked ? 1 : 0,
        item.creationTimestamp.toISOString()
    );

    return {
        shoppingListCustomItemId: insertResult.lastInsertRowId,
        ...item
    };
}

async function getAllCustomItemsFromDatabase() {
    const result = await database.getAllAsync<DatabaseShoppingListCustomItem>(`
        SELECT *
        FROM ShoppingListCustomItem
    `);

    return result.map(dbItem => mapFromDatabaseModel(dbItem));
}

async function updateCustomItemInDatabase(item: ShoppingListCustomItem) {
    await database.runAsync(
        `
        UPDATE ShoppingListCustomItem
        SET text = ?,
            isChecked = ?,
            creationTimestamp = ?
        WHERE shoppingListCustomItemId = ?
        `,
        [
            item.text,
            item.isChecked ? 1 : 0,
            item.creationTimestamp.toISOString(),
            item.shoppingListCustomItemId
        ]
    );
}

async function deleteCustomItemInDatabase(itemId: number) {
    await database.runAsync(
        `
        DELETE FROM ShoppingListCustomItem
        WHERE shoppingListCustomItemId = ?
        `,
        itemId
    );
}

function mapFromDatabaseModel(dbItem: DatabaseShoppingListCustomItem): ShoppingListCustomItem {
    return {
        shoppingListCustomItemId: dbItem.shoppingListCustomItemId,
        text: dbItem.text,
        isChecked: dbItem.isChecked,
        creationTimestamp: new Date(dbItem.creationTimestamp)
    };
}