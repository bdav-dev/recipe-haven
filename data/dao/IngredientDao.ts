import { CalorificValue, Ingredient } from "@/types/IngredientTypes";
import database from "../database/Database";
import { DatabaseIngredient } from "@/types/DatabaseTypes";
import * as FileSystem from 'expo-file-system';
import { CreateIngredientBlueprint, UpdateIngredientBlueprint } from "@/types/dao/IngredientDaoTypes";
import { createDirectoryIfNotExists, getFileExtension, getFileName } from "@/utils/FileSystemUtils";
import { djb2 } from "@/utils/HashUtils";


export async function createIngredient(blueprint: CreateIngredientBlueprint) {
    const ingredient = await insertIngredientInDatabase({
        name: blueprint.name.trim(),
        unit: blueprint.unit,
        pluralName: blueprint.pluralName?.trim(),
        calorificValue: blueprint.calorificValue
    });

    if (blueprint.temporaryImageUri) {
        const imageSrc = await saveIngredientImage(ingredient.ingredientId, blueprint.temporaryImageUri);

        await updateImageSrcInDatabase(ingredient.ingredientId, imageSrc);
        ingredient.imageSrc = imageSrc;
    }

    return ingredient;
}

export async function getAllIngredients() {
    return await getAllIngredientsFromDatabase();
}

export async function updateIngredient(blueprint: UpdateIngredientBlueprint) {
    const originalImageUri = blueprint.originalIngredient.imageSrc;
    let newImageUri = blueprint.updatedValues.imageSrc;

    if (originalImageUri !== newImageUri) {
        if (originalImageUri) {
            await FileSystem.deleteAsync(originalImageUri);
        }

        if (newImageUri) {
            newImageUri = await saveIngredientImage(blueprint.originalIngredient.ingredientId, newImageUri);
        }
    }

    const updatedIngredient: Ingredient = {
        ingredientId: blueprint.originalIngredient.ingredientId,
        imageSrc: newImageUri,
        name: blueprint.updatedValues.name.trim(),
        pluralName: blueprint.updatedValues.pluralName?.trim(),
        unit: blueprint.updatedValues.unit,
        calorificValue: blueprint.updatedValues.calorificValue
    };

    await updateIngredientInDatabase(updatedIngredient);

    return updatedIngredient;
}

export async function deleteIngredient(ingredient: Ingredient) {
    if (ingredient.imageSrc) {
        await FileSystem.deleteAsync(ingredient.imageSrc);
    }

    await deleteIngredientInDatabase(ingredient.ingredientId);
}


async function saveIngredientImage(ingredientId: number, temporaryImageUri: string) {
    const directoryUri = `${FileSystem.documentDirectory}ingredients/${ingredientId}/`
    const hash = djb2(temporaryImageUri);
    const imageUri = `${directoryUri}${hash}.${getFileExtension(temporaryImageUri)}`;

    await createDirectoryIfNotExists(directoryUri);
    await FileSystem.copyAsync({ from: temporaryImageUri, to: imageUri });

    return imageUri;
}


export async function insertIngredientInDatabase(ingredient: Omit<Ingredient, 'ingredientId'>): Promise<Ingredient> {
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

    return {
        ingredientId: insertResult.lastInsertRowId,
        ...ingredient
    };
}

async function getAllIngredientsFromDatabase() {
    const result = await database.getAllAsync<DatabaseIngredient>(`
        SELECT *
        FROM Ingredient
    `);

    return result.map(databaseIngredient => mapFromDatabaseModel(databaseIngredient));
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
            ingredient.ingredientId.toString()
        ]
    );
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


export function mapFromDatabaseModel(databaseIngredient: DatabaseIngredient): Ingredient {
    let calorificValue: CalorificValue | undefined;

    if (databaseIngredient.calorificValueKcal != null && databaseIngredient.calorificValueNUnits != null) {
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

export function createIngredientTableIfNotExists() {
    database.execSync(`
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
