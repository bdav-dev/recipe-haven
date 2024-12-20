import { Ingredient, QuantizedIngredient, Unit } from "@/types/IngredientTypes";
import database from "../database/Database";
import { DatabaseRecipe, FullRecipeQueryResult, RecipeIngredientMap } from "@/types/DatabaseTypes";
import { Recipe } from "@/types/RecipeTypes";
import { Duration } from "../misc/Duration";
import { insertIngredientInDatabase } from "./IngredientDao";
import { UpdateRecipeBlueprint } from "@/types/dao/RecipeDaoTypes";
import * as FileSystem from 'expo-file-system';
import { createDirectoryIfNotExists, getFileExtension } from "@/utils/FileSystemUtils";

export async function getAllRecipes(allIngredients: Ingredient[]) {
    return await getAllRecipesFromDatabase(allIngredients);
}

async function getAllRecipesFromDatabase(allIngredients: Ingredient[]) {
    return (
        await database.getAllAsync<FullRecipeQueryResult>(`
            SELECT
                r.*,
                json_group_array(DISTINCT rt.tagname) AS tagnamesJson,
                json_group_array(DISTINCT json_object('amount', ril.amount, 'ingredientId', i.ingredientId)) AS ingredientsMapJson
            FROM Recipe AS r
            INNER JOIN RecipeTagLink AS rtl
                ON r.recipeId = rtl.recipeId
            INNER JOIN RecipeTag AS rt
                ON rtl.recipeTagId = rt.recipeTagId
            INNER JOIN RecipeIngredientLink AS ril
                ON r.recipeId = ril.recipeId
            INNER JOIN Ingredient AS i
                ON ril.ingredientId = i.ingredientId;
        `)
    )
        .filter(item => item.recipeId != undefined) // If no items are in the database the query above selects a record where everything is null or and empty array. This fixes some bugs that would occur if this "ghost" record would be displayed.
        .map(item => mapFromFullRecipeQueryResult(item, allIngredients));
}

async function insertRecipeInDatabase(dbRecipe: Omit<DatabaseRecipe, 'recipeId'>) {
    const insertResult = await database.runAsync(
        `
        INSERT INTO
            Recipe (imageSrc, title, description, difficulty, preparationTimeInMinutes, isFavorite)
            VALUES (?, ?, ?, ?, ?, ?);
        `,
        dbRecipe.imageSrc ?? null,
        dbRecipe.title,
        dbRecipe.description ?? null,
        dbRecipe.difficulty ?? null,
        dbRecipe.preparationTimeInMinutes ?? null,
        dbRecipe.isFavorite
    );

    return insertResult.lastInsertRowId;
}

async function insertRecipeTagInDatabase(tagName: string) {
    const insertResult = await database.runAsync(
        `
        INSERT INTO
            RecipeTag (tagname)
            VALUES (?);
        `,
        tagName
    );

    return insertResult.lastInsertRowId;
}


function mapFromFullRecipeQueryResult(item: FullRecipeQueryResult, allIngredients: Ingredient[]): Recipe {
    const tagnames: string[] = JSON.parse(item.tagnamesJson);
    const recipeIngredientMaps: RecipeIngredientMap[] = JSON.parse(item.ingredientsMapJson);

    const quantizedIngredients: QuantizedIngredient[] = (
        recipeIngredientMaps
            .map(recipeIngredientMap => ({
                amount: recipeIngredientMap.amount,
                ingredient: allIngredients.find(ingredient => ingredient.ingredientId === recipeIngredientMap.ingredientId)!
            }))
    );

    if (quantizedIngredients.some(item => item.ingredient == undefined)) {
        throw new Error("Some required ingredients are missing");
    }

    return {
        recipeId: item.recipeId,
        description: item.description,
        ingredientsForOnePortion: quantizedIngredients,
        isFavorite: item.isFavorite == 1,
        tags: tagnames,
        title: item.title,
        difficulty: item.difficulty,
        imageSrc: item.imageSrc,
        preparationTime: item.preparationTimeInMinutes ? Duration.ofMinutes(item.preparationTimeInMinutes) : undefined
    }
}


export function createRecipeTablesIfNotExist() {
    createRecipeTableIfNotExists();
    createRecipeTagTableIfNotExists();
    createRecipeIngredientLinkTableIfNotExists();
    createRecipeTagLinkTableIfNotExists();
}

function createRecipeTableIfNotExists() {
    database.execSync(`
        CREATE TABLE IF NOT EXISTS Recipe(
            recipeId INTEGER PRIMARY KEY AUTOINCREMENT,
            imageSrc TEXT,
            title TEXT NOT NULL,
            description TEXT,
            difficulty INTEGER,
            preparationTimeInMinutes INTEGER,
            isFavorite INTEGER NOT NULL
        );
    `);
}

function createRecipeTagTableIfNotExists() {
    database.execSync(`
        CREATE TABLE IF NOT EXISTS RecipeTag(
            recipeTagId INTEGER PRIMARY KEY AUTOINCREMENT,
            tagname TEXT
        );
    `);
}

function createRecipeIngredientLinkTableIfNotExists() {
    database.execSync(`
        CREATE TABLE IF NOT EXISTS RecipeIngredientLink(
            recipeId INTEGER NOT NULL,
            ingredientId INTEGER NOT NULL,
            amount REAL NOT NULL,
            PRIMARY KEY (recipeId, ingredientId),
            FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId),
            FOREIGN KEY (ingredientId) REFERENCES Ingredient(ingredientId)
        );
    `);
}

function createRecipeTagLinkTableIfNotExists() {
    database.execSync(`
        CREATE TABLE IF NOT EXISTS RecipeTagLink(
            recipeId INTEGER NOT NULL,
            recipeTagId INTEGER NOT NULL,
            PRIMARY KEY (recipeId, recipeTagId),
            FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId),
            FOREIGN KEY (recipeTagId) REFERENCES RecipeTag(recipeTagId)
        );
    `);
}

export async function insertTestRecipeWithIngredients() {
    const insertedSugar = await insertIngredientInDatabase({
        name: "Icy Sugar Cube",
        pluralName: "Icy Sugar Cubes",
        unit: Unit.PIECE,
    });
    const insertedBerry = await insertIngredientInDatabase({
        name: "Gnome Berry",
        pluralName: "Gnome Berries",
        unit: Unit.PIECE,
    });
    const insertedDough = await insertIngredientInDatabase({
        name: "Distillery Dough",
        unit: Unit.GRAMM,
    });
    const insertedLime = await insertIngredientInDatabase({
        name: "Desert Lime",
        pluralName: "Desert Limes",
        unit: Unit.PIECE,
    });
    const insertedPineappleMint = await insertIngredientInDatabase({
        name: "Pineapple Mint",
        unit: Unit.GRAMM,
    });
    const insertedIdOfTagMagicial = await insertRecipeTagInDatabase('Magicial');
    const insertedIdOfTagTasty = await insertRecipeTagInDatabase('Tasty');

    const insertedRecipeId = await insertRecipeInDatabase({
        title: "Wondertart",
        description: "Give it to Chef Saltbaker for preparation.",
        isFavorite: 1,
        difficulty: 2,
        preparationTimeInMinutes: 60
    });

    await database.runAsync(
        `
        INSERT INTO
            RecipeTagLink (recipeId, recipeTagId)
            VALUES (?, ?), (?, ?);
        `,
        insertedRecipeId,
        insertedIdOfTagMagicial,
        insertedRecipeId,
        insertedIdOfTagTasty
    );
    await database.runAsync(
        `
        INSERT INTO
            RecipeIngredientLink (recipeId, ingredientId, amount)
            VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?);
        `,
        insertedRecipeId,
        insertedSugar.ingredientId,
        5,
        insertedRecipeId,
        insertedBerry.ingredientId,
        15,
        insertedRecipeId,
        insertedDough.ingredientId,
        1000,
        insertedRecipeId,
        insertedLime.ingredientId,
        2,
        insertedRecipeId,
        insertedPineappleMint.ingredientId,
        2.5
    );

}

export async function deleteRecipe(recipe: Recipe) {
    if (recipe.imageSrc) {
        await FileSystem.deleteAsync(recipe.imageSrc);
    }
    await deleteRecipeFromDatabase(recipe.recipeId);
}

export async function updateRecipe(blueprint: UpdateRecipeBlueprint) {
    const originalImageUri = blueprint.originalRecipe.imageSrc;
    let newImageUri = blueprint.updatedValues.imageSrc;

    if (originalImageUri !== newImageUri) {
        if (originalImageUri) {
            await FileSystem.deleteAsync(originalImageUri);
        }

        if (newImageUri) {
            newImageUri = await saveRecipeImage(blueprint.originalRecipe.recipeId, newImageUri);
        }
    }

    const updatedRecipe: Recipe = {
        recipeId: blueprint.originalRecipe.recipeId,
        imageSrc: newImageUri,
        title: blueprint.updatedValues.title,
        description: blueprint.updatedValues.description,
        difficulty: blueprint.updatedValues.difficulty,
        preparationTime: blueprint.updatedValues.preparationTime,
        isFavorite: blueprint.updatedValues.isFavorite,
        tags: blueprint.updatedValues.tags,
        ingredientsForOnePortion: blueprint.updatedValues.ingredientsForOnePortion
    };

    await updateRecipeInDatabase(updatedRecipe);
    return updatedRecipe;
}

async function saveRecipeImage(recipeId: number, temporaryImageUri: string) {
    const directoryUri = `${FileSystem.documentDirectory}recipes/${recipeId}/`;
    const imageUri = `${directoryUri}img.${getFileExtension(temporaryImageUri)}`;

    await createDirectoryIfNotExists(directoryUri);
    await FileSystem.copyAsync({ from: temporaryImageUri, to: imageUri });

    return imageUri;
}

async function deleteRecipeFromDatabase(recipeId: number) {
    await database.runAsync(
        `DELETE FROM RecipeTagLink WHERE recipeId = ?;`,
        recipeId
    );
    await database.runAsync(
        `DELETE FROM RecipeIngredientLink WHERE recipeId = ?;`,
        recipeId
    );
    await database.runAsync(
        `DELETE FROM Recipe WHERE recipeId = ?;`,
        recipeId
    );
}

async function updateRecipeInDatabase(recipe: Recipe) {
    await database.runAsync(
        `UPDATE Recipe 
         SET imageSrc = ?,
             title = ?,
             description = ?,
             difficulty = ?,
             preparationTimeInMinutes = ?,
             isFavorite = ?
         WHERE recipeId = ?`,
        [
            recipe.imageSrc ?? null,
            recipe.title,
            recipe.description ?? null,
            recipe.difficulty ?? null,
            recipe.preparationTime?.minutes ?? null,
            recipe.isFavorite ? 1 : 0,
            recipe.recipeId.toString()
        ]
    );

    // Update tags
    await database.runAsync(
        `DELETE FROM RecipeTagLink WHERE recipeId = ?;`,
        recipe.recipeId
    );

    for (const tag of recipe.tags) {
        const tagId = await insertRecipeTagInDatabase(tag);
        await database.runAsync(
            `INSERT INTO RecipeTagLink (recipeId, recipeTagId) VALUES (?, ?);`,
            recipe.recipeId,
            tagId
        );
    }

    // Update ingredients
    await database.runAsync(
        `DELETE FROM RecipeIngredientLink WHERE recipeId = ?;`,
        recipe.recipeId
    );

    for (const ingredient of recipe.ingredientsForOnePortion) {
        await database.runAsync(
            `INSERT INTO RecipeIngredientLink (recipeId, ingredientId, amount) VALUES (?, ?, ?);`,
            recipe.recipeId,
            ingredient.ingredient.ingredientId,
            ingredient.amount
        );
    }
}
