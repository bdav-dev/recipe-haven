import database from "./Database";

export async function createIngredientTable() {

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
