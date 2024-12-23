import { Ingredient, Unit } from "@/types/IngredientTypes";
import database from "../database/Database";
import { createIngredient } from "./IngredientDao";
import * as FileSystem from 'expo-file-system';

export async function isInitial() {
    const count = (
        await database.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) AS count FROM Initial;`
        )
    )?.count ?? 0;

    await imagetest();

    return count >= 1;
}

async function imagetest() {
    const imgFile = "a.png";
    const aImage = require('../../assets/' + imgFile);
    const filePath = FileSystem.cacheDirectory + "a.png"

    console.log(aImage);
    
    
}

export async function setIsInitial(isInitial: boolean) {
    if (isInitial) {
        await database.execAsync('DELETE FROM Initial');
    } else {
        await database.execAsync('INSERT INTO Initial (initial) VALUES (1)');
    }
}

export async function createDefaultIngredients(): Promise<Ingredient[]> {
    return [
        (
            await createIngredient({
                name: "Wasser",
                unit: Unit.LITER,
                calorificValue: { kcal: 0, nUnits: 1 }
            })
        ),
        (
            await createIngredient({
                name: "Milch (3,5% Fett)",
                unit: Unit.LITER,
                calorificValue: { kcal: 64, nUnits: 0.1 }
            })
        ),
        (
            await createIngredient({
                name: "Mehl",
                unit: Unit.GRAMM,
                calorificValue: { kcal: 364, nUnits: 100 }
            })
        ),
        (
            await createIngredient({
                name: "Haselnuss",
                pluralName: "Haselnüsse",
                unit: Unit.PIECE,
                calorificValue: { kcal: 14, nUnits: 1 }
            })
        ),
        (
            await createIngredient({
                name: "Zucker",
                unit: Unit.GRAMM,
                calorificValue: { kcal: 287, nUnits: 100 }
            })
        )
    ];
}

export function createInitTableIfNotExists() {
    database.execSync(
        `
        CREATE TABLE IF NOT EXISTS Initial(
            initial INTEGER PRIMARY KEY
        );
        `
    );
}