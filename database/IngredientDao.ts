import database from "./Database";

export async function createIngredientTableIfNotExists() {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Ingredient(
            ingredientId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            pluralName TEXT,
            imageSrc TEXT,
            unit INTEGER NOT NULL,
            kcalPerUnit REAL
        );
    `);
}

export async function insertIngredient(ingredient: Ingredient) {
    const insertResult = await database.runAsync(
        `
        INSERT INTO
            Ingredient (name, pluralName, imageSrc, unit, kcalPerUnit)
            VALUES (?, ?, ?, ?, ?);
        `,
        ingredient.name,
        ingredient.pluralName ?? null,
        ingredient.imageSrc ?? null,
        ingredient.unit.valueOf(),
        ingredient.kcalPerUnit ?? null
    );
    ingredient.ingredientId = insertResult.lastInsertRowId;
}

export async function deleteAllIngredients() {
    await database.execAsync(`DELETE FROM Ingredient`);
}

export async function insertExampleIngredient() {
    await database.execAsync(`
        INSERT INTO Ingredient (name, unit) VALUES ("name!", 1);
    `);
}

export async function getAllIngredients() {
    const result = await database.getAllAsync<Ingredient>(`
        SELECT *
        FROM Ingredient
    `);

    return result;
}
