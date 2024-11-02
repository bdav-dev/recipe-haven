import { DatabaseIngredient, Ingredient, IngredientBlueprint } from "@/types/MainAppTypes";
import database from "./Database";
import * as FileSystem from 'expo-file-system';
import { createDirectoryIfNotExists, getFileExtension } from "@/utils/FileSystemUtils";
import { CalorificValue } from "@/types/OtherTypes";

export async function createIngredientTableIfNotExists() {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Ingredient(
            ingredientId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            pluralName TEXT,
            imageSrc TEXT,
            unit INTEGER NOT NULL,
            calorificValueKcal REAL,
            calorificValueNUnits REAL
        );
    `);
}

export async function getAllIngredients() {
    const result = await database.getAllAsync<DatabaseIngredient>(`
        SELECT *
        FROM Ingredient
    `);

    return result.map(databaseIngredient => mapFromDatabaseModel(databaseIngredient));
}

export async function createIngredient(createIngredient: IngredientBlueprint) {
    const ingredient: Ingredient = {
        name: createIngredient.name,
        unit: createIngredient.unit,
        pluralName: createIngredient.pluralName,
        calorificValue: createIngredient.calorificValue
    }

    const ingredientId = await insertIngredient(ingredient);
    ingredient.ingredientId = ingredientId;

    if (createIngredient.temporaryImageUri) {
        const imageSrc = await saveIngredientImage(ingredientId, createIngredient.temporaryImageUri);

        await updateImageSrc(ingredientId, imageSrc);
        ingredient.imageSrc = imageSrc;
    }

    return ingredient;
}

export async function deleteAllIngredients() {
    await database.execAsync(`DELETE FROM Ingredient`);
}

async function saveIngredientImage(ingredientId: number, temporaryImageUri: string) {
    const directoryUri = `${FileSystem.documentDirectory}ingredients/${ingredientId}/`
    const imageUri = `${directoryUri}img.${getFileExtension(temporaryImageUri)}`;

    await createDirectoryIfNotExists(directoryUri);
    await FileSystem.copyAsync({ from: temporaryImageUri, to: imageUri });

    return imageUri;
}

async function updateImageSrc(ingredientId: number, imageSrc: string) {
    await database.runAsync(
        `
        UPDATE Ingredient
            SET imageSrc = ?
            WHERE ingredientId = ?
        `,
        imageSrc,
        ingredientId
    );
}

async function insertIngredient(ingredient: Ingredient) {
    const insertResult = await database.runAsync(
        `
        INSERT INTO
            Ingredient (name, pluralName, imageSrc, unit, calorificValueKcal, calorificValueNUnits)
            VALUES (?, ?, ?, ?, ?, ?);
        `,
        ingredient.name,
        ingredient.pluralName ?? null,
        ingredient.imageSrc ?? null,
        ingredient.unit.valueOf(),
        ingredient.calorificValue?.kcal ?? null,
        ingredient.calorificValue?.nUnits ?? null
    );

    return insertResult.lastInsertRowId;
}

function mapFromDatabaseModel(databaseIngredient: DatabaseIngredient): Ingredient {
    let calorificValue: CalorificValue | undefined;

    if (databaseIngredient.calorificValueKcal != undefined && databaseIngredient.calorificValueNUnits != undefined) {
        calorificValue = {
            kcal: databaseIngredient.calorificValueKcal,
            nUnits: databaseIngredient.calorificValueNUnits
        };
    }

    return {
        name: databaseIngredient.name,
        unit: databaseIngredient.unit,
        imageSrc: databaseIngredient.imageSrc,
        ingredientId: databaseIngredient.ingredientId,
        pluralName: databaseIngredient.pluralName,
        calorificValue: calorificValue
    }
}
