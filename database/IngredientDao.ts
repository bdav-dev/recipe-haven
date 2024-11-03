import { DatabaseIngredient, Ingredient, CreateIngredientBlueprint, UpdateIngredientBlueprint } from "@/types/IngredientTypes";
import database from "./Database";
import * as FileSystem from 'expo-file-system';
import { createDirectoryIfNotExists, getFileExtension } from "@/utils/FileSystemUtils";
import { CalorificValue } from "@/types/MiscellaneousTypes";

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

export async function createIngredient(blueprint: CreateIngredientBlueprint) {
    const ingredient: Ingredient = {
        name: blueprint.name,
        unit: blueprint.unit,
        pluralName: blueprint.pluralName,
        calorificValue: blueprint.calorificValue
    }

    const ingredientId = await insertIngredientInDatabase(ingredient);
    ingredient.ingredientId = ingredientId;

    if (blueprint.temporaryImageUri) {
        const imageSrc = await saveIngredientImage(ingredientId, blueprint.temporaryImageUri);

        await updateImageSrcInDatabase(ingredientId, imageSrc);
        ingredient.imageSrc = imageSrc;
    }

    return ingredient;
}

export async function updateIngredient(blueprint: UpdateIngredientBlueprint) {
    const originalImageUri = blueprint.originalIngredient.imageSrc;
    const newImageUri = blueprint.updatedValues.imageSrc;

    if (originalImageUri !== newImageUri) {
        if (originalImageUri !== undefined) {
            await FileSystem.deleteAsync(originalImageUri)
        }

        if (newImageUri !== undefined) {
            await saveIngredientImage(blueprint.originalIngredient.ingredientId!, newImageUri)
        }
    }

    const updatedIngredient: Ingredient = {
        ingredientId: blueprint.originalIngredient.ingredientId,
        imageSrc: newImageUri,
        name: blueprint.updatedValues.name,
        pluralName: blueprint.updatedValues.pluralName,
        unit: blueprint.updatedValues.unit,
        calorificValue: blueprint.updatedValues.calorificValue
    }

    await updateIngredientInDatabase(updatedIngredient);

    return updatedIngredient;
}

export async function deleteIngredient(ingredient: Ingredient) {
    if (ingredient.imageSrc !== undefined) {
        FileSystem.deleteAsync(ingredient.imageSrc);
    }

    await deleteIngredientInDatabase(ingredient.ingredientId!);
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

async function updateIngredientInDatabase(ingredient: Ingredient) {
    await database.runAsync(
        `
        UPDATE Ingredient
        SET name = ?,
            pluralName = ?,
            imageSrc = ?,
            unit = ?,
            calorificValueKcal = ?,
            calorificValueNUnits = ?
        WHERE ingredientId = ?
        `,
        [
            ingredient.name,
            ingredient.pluralName ?? null,
            ingredient.imageSrc ?? null,
            ingredient.unit,
            ingredient.calorificValue?.kcal ?? null,
            ingredient.calorificValue?.nUnits ?? null,
            ingredient.ingredientId!.toString()
        ]
    );
}

async function updateImageSrcInDatabase(ingredientId: number, imageSrc: string) {
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

async function insertIngredientInDatabase(ingredient: Ingredient) {
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

async function deleteIngredientInDatabase(ingredientId: number) {
    await database.runAsync(
        `
        DELETE
        FROM Ingredient
        WHERE ingredientId = ?
        `,
        ingredientId
    );
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
        ingredientId: databaseIngredient.ingredientId,
        imageSrc: databaseIngredient.imageSrc,
        name: databaseIngredient.name,
        pluralName: databaseIngredient.pluralName,
        unit: databaseIngredient.unit,
        calorificValue: calorificValue
    }
}
